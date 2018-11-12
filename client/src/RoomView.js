import React from "react";

import "./RoomView.css";

const RoomView = ({ num, occupancy, mini }) => {
  return (
    <div className={["room", occupancy, mini && "sm"].join(" ")}>
      <span className="number">{num}</span>
    </div>
  );
};

export default RoomView;
