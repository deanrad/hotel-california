import React, { Component } from "react";
import io from "socket.io-client";
import { ajaxStreamingGet, Agent } from "antares-protocol";

import "./App.css";
import Select from "./routes/Select";
import { store } from "./store";
import { Observable, interval } from "rxjs";
import { map } from "rxjs/operators";

const url =
  process.NODE_ENV === "production"
    ? document.location.href.replace(/\/\w+$/, "") // get rid of path
    : "http://localhost:8470";

const socket = io(url);
socket.on("hello", () => {
  console.log({ type: "socket.connect" });
});

// TODO When any component processes a holdRoom action, forward it via the WS.

// TODO After 3 seconds, release a hold on a room

// TODO cancel upon the first click on the document
if (document.location.hash === "#demo") {
  console.log("entering demo mode");
  // TODO every 5 seconds Hold a random room
  const rooms = ["10", "11", "20", "21", "30", "31"];
  const roomHolds = interval(5000).pipe(
    map(() => ({
      type: "holdRoom",
      payload: {
        hold: true,
        num: rooms[Math.floor(Math.random() * 6)]
      }
    }))
  );
  const demoSub = roomHolds.subscribe(action => agent.process(action));

  const firstClick = new Promise(resolve =>
    document.addEventListener("click", resolve)
  );
  firstClick.then(() => {
    demoSub.unsubscribe();
    console.log("canceled demo mode");
  });
}

// TODO Return an Observable of the objects we recieve
// in the callbacks of: socket.on("setOccupancy", ...)

const socketOccupancies = new Observable(notify => {
  socket.on("setOccupancy", payload => {
    notify.next({
      type: "setOccupancy",
      payload
    });
  });
});

const agent = new Agent();
agent.addFilter(({ action }) => store.dispatch(action));
agent.on("holdRoom", ({ action }) => socket.emit("holdRoom", action.payload));
socketOccupancies.subscribe(action => agent.process(action));

class App extends Component {
  componentDidMount() {
    // TODO With the objects field of the /api/rooms GET result
    // send it to the agent, not store, in an action of type `loadRooms`
    this.callApi("/api/rooms")
      .then(({ objects }) => {
        store.dispatch({ type: "loadRooms", payload: objects });
      })
      .catch(err => console.log(err));

    // TODO For the Observable of results from the /api/occupancy REST endpoint,
    // send each to the agent in an action of type `setOccupancy`
    this.callApi("/api/occupancy").then(records => {
      records.forEach(record =>
        store.dispatch({ type: "setOccupancy", payload: record })
      );
    });
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
