import React, { Component } from "react";

import "./RoomView.css";

export default ({ num, occupancy }) => {
  return (
    <div class={["room", occupancy].join(" ")}>
      <span class="number">{num}</span>
    </div>
  );
};
