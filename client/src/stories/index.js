import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { Button, Welcome } from "@storybook/react/demo";
import RoomView from "../RoomView";

storiesOf("Welcome", module).add("to the Hotel California !!", () => (
  <div>
    <h1>Hotel California</h1>
    <p>TODO write Storybook README</p>
  </div>
));

storiesOf("Routes", module)
  .add("/select", () => (
    <div>
      <h2>Welcome to the Hotel California</h2>
      <h3>Pick a room:</h3>
      <div class="row">
        <RoomView num="20" occupancy="open" />
        <RoomView num="21" occupancy="hold mine" />
      </div>
      <div class="row">
        <RoomView num="10" occupancy="hold" />
        <RoomView num="11" occupancy="full" />
      </div>
      <h4>
        Key:
        <p>
          <span class="legend open">Open</span>
          <span class="legend hold">On Hold</span>
          <span class="legend hold mine">Your Hold</span>
          <span class="legend full">Not Avail</span>
        </p>
      </h4>
    </div>
  ))
  .add("/reserve", () => <RoomView num="10" occupancy="open" />);

storiesOf("RoomView", module)
  .add("open", () => <RoomView num="10" occupancy="open" />)
  .add("full", () => <RoomView num="10" occupancy="full" />)
  .add("hold", () => <RoomView num="10" occupancy="hold" />)
  .add("my hold", () => <RoomView num="10" occupancy="hold mine" />);
