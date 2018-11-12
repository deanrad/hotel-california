import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { Button, Welcome } from "@storybook/react/demo";
import RoomView from "../RoomView";
import Select from "../routes/Select";
import Reserve from "../routes/Reserve";

import { createStore } from "redux";
const initialState = {
  room: [
    { num: "30" },
    { num: "31" },
    { num: "20" },
    { num: "21" },
    { num: "10" },
    { num: "11" }
  ],
  occupancy: {
    "30": "hold",
    "31": "hold",
    "20": "open",
    "21": "full",
    "10": "full",
    "11": "open"
  }
};
const store = createStore(
  (s = initialState) => s,
  typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__()
);

storiesOf("Welcome", module).add("to the Hotel California !!", () => (
  <div>
    <h1>Hotel California</h1>
    <p>TODO write Storybook README</p>
  </div>
));

storiesOf("Routes", module)
  .add("/select", () => <Select store={store} />)
  .add("/reserve/20 - Ok", () => <Reserve store={store} roomChoice="20" />)
  .add("/reserve/30 - Error", () => <RoomView num="10" occupancy="open" />)
  .add("/reserve/20/submit", () => <RoomView num="10" occupancy="open" />)
  .add("/reserve/20/submit/success", () => (
    <RoomView num="10" occupancy="open" />
  ))
  .add("/reserve/20/submit/error", () => (
    <RoomView num="10" occupancy="open" />
  ));

storiesOf("RoomView", module)
  .add("open", () => <RoomView num="10" occupancy="open" />)
  .add("full", () => <RoomView num="10" occupancy="full" />)
  .add("hold", () => <RoomView num="10" occupancy="hold" />)
  .add("my hold", () => <RoomView num="10" occupancy="hold mine" />);
