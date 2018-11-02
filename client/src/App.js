import React, { Component } from "react";

import "./App.css";
import Select from "./routes/Select";
import { store } from "./store";

class App extends Component {
  componentDidMount() {
    this.callApi("/api/rooms")
      .then(({ objects }) => {
        store.dispatch({ type: "loadRooms", payload: objects });
      })
      .catch(err => console.log(err));
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
