import React, { Component } from "react";
import io from "socket.io-client";

import "./App.css";
import Select from "./routes/Select";
import { store } from "./store";
import { Observable } from "rxjs";
import { ajaxStreamingGet, Agent, concat } from "antares-protocol";

const agent = new Agent();
agent.addFilter(({ action }) => store.dispatch(action));

const url =
  process.env.NODE_ENV === "production"
    ? document.location.href.replace(/\/\w+$/, "") // get rid of path
    : "http://localhost:8470";

const socket = io(url);
socket.on("hello", () => {
  agent.process({ type: "socket.connect" });
});
const liveOccupancyPayloads = () => {
  return new Observable(notify => {
    socket.on("setOccupancy", payload => notify.next(payload));
  });
};

class App extends Component {
  componentDidMount() {
    this.callApi("/api/rooms")
      .then(({ objects }) => {
        agent.process({ type: "loadRooms", payload: objects });
      })
      .catch(err => console.log(err));

    concat(
      ajaxStreamingGet({
        url: "/api/occupancy"
      }),
      liveOccupancyPayloads()
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
