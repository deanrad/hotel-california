import React from "react";
import RoomView from "../RoomView";

export default () => {
  return (
    <div>
      <h2>Welcome to the Hotel California</h2>
      <h3>Pick a room:</h3>
      <div class="floor">
        <RoomView num="30" occupancy="hold" />
        <RoomView num="31" occupancy="hold" />
      </div>
      <div class="floor">
        <RoomView num="20" occupancy="open" />
        <RoomView num="21" occupancy="full" />
      </div>
      <div class="floor">
        <RoomView num="10" occupancy="full" />
        <RoomView num="11" occupancy="open" />
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
  );
};
