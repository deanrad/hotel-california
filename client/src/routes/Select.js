import React from "react";
import RoomView from "../RoomView";
import { createStore } from "redux";
import { connect } from "react-redux";
export const initialState = {
  roomViews: [
    { num: "30", occupancy: "hold" },
    { num: "31", occupancy: "hold" },
    { num: "20", occupancy: "open" },
    { num: "21", occupancy: "full" },
    { num: "10", occupancy: "full" },
    { num: "11", occupancy: "open" }
  ]
};

export const store = createStore((state = initialState, action) => state);

// Formats for the UI component
export const mapStateToProps = state => {
  const { roomViews } = state;
  const floors = [];
  for (let i = 0; i < roomViews.length; i += 2) {
    floors.push([roomViews[i], roomViews[i + 1]]);
  }
  return { floors };
};

const Floor = ({ children: rooms }) => (
  <div className="floor">
    {rooms.map(room => (
      <RoomView key={room.num} {...room} />
    ))}
  </div>
);
const Select = ({ floors }) => {
  return (
    <div>
      <h2>Welcome to the Hotel California</h2>
      <h3>Pick a room:</h3>
      {floors.map((floor, idx) => (
        <Floor key={idx}>{floor}</Floor>
      ))}
      <p>
        Key:
        <span className="legend open">Open</span>
        <span className="legend hold">On Hold</span>
        <span className="legend hold mine">Your Hold</span>
        <span className="legend full">Not Avail</span>
      </p>
    </div>
  );
};

export default connect(mapStateToProps)(Select);
