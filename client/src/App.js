import React, { Component } from "react";
import io from "socket.io-client";

import "./App.css";
import Select from "./routes/Select";
import { store } from "./store";
import { Observable, empty, interval } from "rxjs";
import { map } from "rxjs/operators";
import { ajaxStreamingGet, Agent, concat, after } from "antares-protocol";

const agente = new Agent();
Object.assign(agente, {
  cuando: agente.on,
  filtrar: agente.addFilter,
  nuevo: agente.process
});
Object.assign(window, { ajaxStreamingGet, concat, after, agente, store });

agente.filtrar(({ action }) => store.dispatch(action));

const url =
  process.env.NODE_ENV === "production"
    ? document.location.href.replace(/\/\w+$/, "") // get rid of path
    : "http://localhost:8470";

const socket = io(url);
socket.on("hello", () => {
  agente.nuevo({ type: "socket.connect" });
});

// TODO When any component sends us a holdRoom action, forward it via the WS.
agente.cuando("holdRoom", ({ action }) => {
  socket.emit("holdRoom", action.payload);
});

// TODO After 3 seconds, release the hold
agente.cuando(
  "holdRoom",
  ({ action }) => {
    const { num, hold } = action.payload;
    if (!hold) return empty();
    return after(3000, () => ({
      type: "holdRoom",
      payload: {
        num,
        hold: false
      }
    }));
  },
  // TODO ensure that a client can 'keep alive' a hold by renewing the previous timer each time
  { processResults: true, concurrency: "cutoff" }
);

// TODO every 5 seconds Hold a random room
// TODO cancel upon the first click on the document
const firstClick = new Promise(resolve =>
  document.addEventListener("click", resolve)
);
const randomHolds = interval(5000).pipe(
  map(() => {
    const roomNum = ["10", "11", "20", "21", "30", "31"][
      Math.floor(Math.random() * 6.0)
    ];
    return { type: "holdRoom", payload: { num: roomNum, hold: true } };
  })
);
if (document.location.hash === "#demo") {
  console.log("entering demo mode");
  const sub = randomHolds.subscribe(action => agente.nuevo(action));
  firstClick.then(() => {
    sub.unsubscribe();
    console.log("canceled demo mode");
  });
}

// TODO Return an Observable of the objects we recieve
// in the callbacks of: socket.on("setOccupancy", ...)
const wsOccupancyPayloads = () => {
  return new Observable(notify => {
    socket.on("setOccupancy", payload => notify.next(payload));
  });
};

class App extends Component {
  componentDidMount() {
    // TODO With the objects field of the /api/rooms GET result
    // send it to the store in an action of type `loadRooms`
    this.callApi("/api/rooms")
      .then(({ objects }) => {
        agente.nuevo({ type: "loadRooms", payload: objects });
      })
      .catch(err => console.log(err));

    // TODO For the Observable of results from the /api/occupancy REST endpoint,
    // send each to the store in an action of type `setOccupancy`
    concat(
      // TODO Return an Observable of the results from the /api/occupancy REST endpoint
      ajaxStreamingGet({
        url: "/api/occupancy"
      }),
      // TODO Return an Observable of the results from WS 'setOccupancy' messages
      wsOccupancyPayloads()
    ).subscribe(payload => agente.nuevo({ type: "setOccupancy", payload }));
  }

  callApi = async url => {
    const response = await fetch(url);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div className="App">
        <Select store={store} />
      </div>
    );
  }
}

export default App;
