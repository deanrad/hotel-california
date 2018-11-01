import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { Button, Welcome } from "@storybook/react/demo";
import RoomView from "../RoomView";
import Select from "../routes/Select";

storiesOf("Welcome", module).add("to the Hotel California !!", () => (
  <div>
    <h1>Hotel California</h1>
    <p>TODO write Storybook README</p>
  </div>
));

storiesOf("Routes", module)
  .add("/select", () => <Select />)
  .add("/reserve/30 - Error", () => <RoomView num="10" occupancy="open" />)
  .add("/reserve/20 - Ok", () => <RoomView num="10" occupancy="open" />)
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
