import React, { Component } from "react";

import "./RoomView.css";

export default ({ num, occupancy }) => {
  return (
    <div className={["room", occupancy].join(" ")}>
      <span className="number">{num}</span>
    </div>
  );
};
