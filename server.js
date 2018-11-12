const express = require("express");
const path = require("path");
const morgan = require("morgan");

const { interval, merge, from } = require("rxjs");
const { map, tap, share } = require("rxjs/operators");
const app = express();
const http = require("http").Server(app);
const port = process.env.PORT || 8470;

// TODO Bring in a store
const { store } = require("./server-store");

app.use(morgan("dev"));

// API calls
app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From The Server." });
});

// TODO Return state of store instead of hardcoded
app.get("/api/rooms", (req, res) => {
  const { rooms } = store.getState();
  res.send({
    count: rooms.length,
    objects: rooms
  });
});

// TODO Return state of store instead of hardcoded
// TODO Build up {num, occupancy} objects from the state
const createRoomViews = state => {
  const { rooms, occupancy } = state;
  return rooms.map(room => ({
    ...room,
    occupancy: occupancy[room.num] || "open"
  }));
};

app.get("/api/occupancy", (req, res) => {
  res.send(createRoomViews(store.getState()));
});

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

http.listen(port, () => console.log(`Server listening on port ${port}`));

const { Agent } = require("antares-protocol");
const agent = new Agent();

// TODO Define an Observable that maps processed actions of type 'holdRoom'
// to FSAs of type setOccupancy (which will be sent out to clients)
const realOccupancyChanges = agent.allOfType("holdRoom").pipe(
  map(action => ({
    type: "setOccupancy",
    payload: {
      num: action.payload.num,
      occupancy: action.payload.hold ? "hold" : "open"
    }
  }))
);

// TODO Process holdRoom actions through the store so new clients
// will get the actual state. Later, we'll persist the change in the db
agent.addFilter(({ action }) => store.dispatch(action), {
  actionsOfType: "holdRoom"
});
// WebSocket stuff follows
const io = require("socket.io").listen(http);
io.on("connection", client => {
  console.log("Got a client connection!");

  // Create a subscription for this new client to the occupancy changes
  // TODO subscribe to realOccupancyChanges instead of simulatedOccupancyChanges
  const notifyClient = action => {
    console.log("Send: " + action.type + ", " + JSON.stringify(action.payload));
    client.emit(action.type, action.payload);
  };
  const sub = simulatedOccupancyChanges.subscribe(action =>
    notifyClient(action)
  );
  const sub2 = realOccupancyChanges.subscribe(action => notifyClient(action));

  // TODO These types of client actions are ones we went to process
  // through our own agent/store
  client.on("holdRoom", payload => {
    agent.process({ type: "holdRoom", payload });
  });

  // Be sure and clean up our resources when done
  client.on("disconnect", () => {
    console.log("Client disconnected");
    sub.unsubscribe();
    sub2.unsubscribe();
  });
});

// This should be subscribed once per
var simulatedOccupancyChanges = interval(5000).pipe(
  map(i => i % 2 === 1),
  map(hold => ({
    type: "setOccupancy",
    payload: {
      num: "20",
      occupancy: hold ? "hold" : "open"
    }
  })),
  tap(({ payload: { num, occupancy } }) =>
    console.log(`> Room ${num} is now ${occupancy}`)
  ),
  share()
);
