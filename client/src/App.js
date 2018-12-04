import React, { Component } from "react";
import io from "socket.io-client";

import "./App.css";
import Select from "./routes/Select";
import { store } from "./store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Agent, ajaxStreamingGet } from "antares-protocol";
import oboe from "oboe";
Object.assign(window, { oboe });
const agent = new Agent();

const url =
  process.NODE_ENV === "production"
    ? document.location.href.replace(/\/\w+$/, "") // get rid of path
    : "http://localhost:8470";

const socket = io(url);
socket.on("hello", () => {
  console.log({ type: "socket.connect" });
});

// TODO Represent all "setOccupancy" WebSocket messages as an
// Observable that emits FSAs of type "setOccupancy".
const socketOccupancies = new Observable(notify => {
  socket.on("setOccupancy", payload => {
    notify.next(payload);
  });
}).pipe(map(payload => ({ type: "setOccupancy", payload })));

agent.addFilter(({ action }) => store.dispatch(action));
agent.on("holdRoom", ({ action }) => socket.emit("holdRoom", action.payload));
agent.subscribe(socketOccupancies);

// TODO When any component processes a holdRoom action, forward it via the WS.

// TODO After 3 seconds, release a hold on a room

// TODO every 5 seconds Hold a random room
// TODO cancel upon the first click on the document
if (document.location.hash === "#demo") {
  console.log("entering demo mode");
  const firstClick = new Promise(resolve =>
    document.addEventListener("click", resolve)
  );
  firstClick.then(() => {
    console.log("canceled demo mode");
  });
}

// TODO Return an Observable of the objects we recieve
// in the callbacks of: socket.on("setOccupancy", ...)

class App extends Component {
  componentDidMount() {
    const restRooms = ajaxStreamingGet({
      url: "/api/rooms",
      expandKey: "objects"
    }).pipe(map(rooms => ({ type: "loadRooms", payload: rooms })));

    agent.subscribe(restRooms);

    // TODO For the Observable of results from the /api/occupancy REST endpoint,
    // send each to the agent in an action of type `setOccupancy`

    const restOccupancy = ajaxStreamingGet({
      url: "/api/occupancy",
      expandKey: "$*"
    }).pipe(
      map(occupancy => ({
        type: "setOccupancy",
        payload: occupancy
      }))
    );

    agent.subscribe(restOccupancy);
  }

  render() {
    return (
      <div className="App">
        <Select store={store} process={action => agent.process(action)} />
      </div>
    );
  }
}

export default App;
