import React, { Component } from "react";
import io from "socket.io-client";

import "./App.css";
import Select from "./routes/Select";
import { store } from "./store";
import { ajaxStreamingGet } from "antares-protocol";

const url =
  process.env.NODE_ENV === "production"
    ? document.location.href.replace(/\/\w+$/, "") // get rid of path
    : "http://localhost:8470";

const socket = io(url);
socket.on("hello", () => {
  store.dispatch({ type: "socket.connect" });
});

class App extends Component {
  componentDidMount() {
    this.callApi("/api/rooms")
      .then(({ objects }) => {
        store.dispatch({ type: "loadRooms", payload: objects });
      })
      .catch(err => console.log(err));

    ajaxStreamingGet({
      url: "/api/occupancy"
    }).subscribe(occ => store.dispatch({ type: "setOccupancy", payload: occ }));
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
