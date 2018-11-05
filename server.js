const express = require("express");
const path = require("path");
const morgan = require("morgan");
const { interval } = require("rxjs");
const { map, share } = require("rxjs/operators");
const app = express();
const http = require("http").Server(app);
const port = process.env.PORT || 8470;

app.use(morgan("dev"));

// API calls
app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From The Server." });
});

app.get("/api/rooms", (req, res) => {
  const rooms = [
    { num: "30" },
    { num: "31" },
    { num: "20" },
    { num: "21" },
    { num: "10" },
    { num: "11" }
  ];
  res.send({
    count: rooms.length,
    objects: rooms
  });
});

app.get("/api/occupancy", (req, res) => {
  res.send([
    { num: "10", occupancy: "full" },
    { num: "11", occupancy: "open" },
    { num: "20", occupancy: "open" },
    { num: "21", occupancy: "full" },
    { num: "30", occupancy: "hold" },
    { num: "31", occupancy: "hold" }
  ]);
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

// WebSocket stuff follows
const io = require("socket.io").listen(http);
io.on("connection", client => {
  console.log("Got a client connection!");

  // Create an Observable, and subscribe to it
  simulatedOccupancyChanges.subscribe(action => {
    console.log("Sending: " + JSON.stringify(action));
    client.emit(action.type, action.payload);
  });

  client.on("disconnect", () => console.log("Client disconnected"));
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
  share()
);
