import React from "react";
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

// Agent Configuration
// All action types (the two we care about are holdRoom and setOccupancy)
agent.addFilter(({ action }) => store.dispatch(action));
agent.on("holdRoom", ({ action }) => socket.emit("holdRoom", action.payload));

// Set up our agent to be populated from REST calls and WS occupancies
const restRooms = ajaxStreamingGet({
  url: "/api/rooms",
  expandKey: "objects"
}).pipe(map(rooms => ({ type: "loadRooms", payload: rooms })));

const restOccupancy = ajaxStreamingGet({
  url: "/api/occupancy",
  expandKey: "$*"
}).pipe(
  map(occupancy => ({
    type: "setOccupancy",
    payload: occupancy
  }))
);

const socketOccupancies = new Observable(notify => {
  socket.on("setOccupancy", payload => {
    notify.next(payload);
  });
}).pipe(map(payload => ({ type: "setOccupancy", payload })));

agent.subscribe(restRooms);
agent.subscribe(restOccupancy);
agent.subscribe(socketOccupancies);

// Export the App as a functional component whose state is
// entirely derived from the store. Give it access to a
// `process` method by which to send actions to the agent.
const App = () => (
  <div className="App">
    <Select store={store} process={action => agent.process(action)} />
  </div>
);

export default App;
