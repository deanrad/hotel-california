import React, { Component } from "react";
import io from "socket.io-client";

import "./App.css";
import Select from "./routes/Select";
import { store } from "./store";
import { Observable, empty } from "rxjs";
import { ajaxStreamingGet, Agent, concat, after } from "antares-protocol";

const agent = new Agent();
window._agent = agent;
agent.addFilter(({ action }) => store.dispatch(action));

const url =
  process.env.NODE_ENV === "production"
    ? document.location.href.replace(/\/\w+$/, "") // get rid of path
    : "http://localhost:8470";

const socket = io(url);
socket.on("hello", () => {
  agent.process({ type: "socket.connect" });
});

// TODO When any component sends us a holdRoom action, forward it via the WS.
agent.on("holdRoom", ({ action }) => {
  socket.emit("holdRoom", action.payload);
});

// TODO After 3 seconds, release the hold
agent.on(
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
  { processResults: true, concurrency: 'cutoff' }
);

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
        agent.process({ type: "loadRooms", payload: objects });
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
    ).subscribe(payload => agent.process({ type: "setOccupancy", payload }));
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
