import React from "react";

import "./RoomView.css";

const RoomView = ({ num, occupancy, mini, onClick }) => {
  return (
    <div
      className={["room", occupancy, mini && "sm"].join(" ")}
      onClick={onClick}
    >
      <span className="number">{num}</span>
    </div>
  );
};

export default RoomView;
