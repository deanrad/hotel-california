import React, { Component } from "react";
import io from "socket.io-client";

import "./App.css";
import Select from "./routes/Select";
import { store } from "./store";
import { process } from "./agent";
import { ajaxStreamingGet } from "antares-protocol";
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

// TODO Create an Observable of WS setOccupancy payloads
const socketOccupancies = new Observable(notify => {
  socket.on("setOccupancy", payload => {
    process({ type: "setOccupancy", payload });
  });
});

// TODO When any component processes a holdRoom action, forward it via the WS.

// TODO After 3 seconds, release a hold on a room

// TODO every 5 seconds Hold a random room
// TODO cancel upon the first click on the document
if (document.location.hash === "#demo") {
  console.log("entering demo mode");
  const firstClick = new Promise(resolve =>
    document.addEventListener("click", resolve)
  );

  const rooms = ["10", "11", "20", "21", "30", "31"];
  const sub = interval(3000)
    .pipe(
      map(() => ({
        type: "holdRoom",
        payload: {
          hold: true,
          num: rooms[Math.floor(Math.random() * 6)]
        }
      }))
    )
    .subscribe(action => process(action));

  firstClick.then(() => {
    sub.unsubscribe();
    console.log("canceled demo mode");
  });
}

// TODO Return an Observable of the objects we recieve
// in the callbacks of: socket.on("setOccupancy", ...)

class App extends Component {
  componentDidMount() {
    // TODO With the objects field of the /api/rooms GET result
    // send it to the agent, not store, in an action of type `loadRooms`
    this.callApi("/api/rooms")
      .then(({ objects }) => {
        process({ type: "loadRooms", payload: objects });
      })
      .catch(err => console.log(err));

    // TODO 1) For the Observable of results from the /api/occupancy REST endpoint,
    // send each to the agent in an action of type `setOccupancy`
    ajaxStreamingGet({ url: "/api/occupancy" }).subscribe(record =>
      process({ type: "setOccupancy", payload: record })
    );

    socketOccupancies.subscribe();
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
