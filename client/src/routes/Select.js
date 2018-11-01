import React from "react";
import RoomView from "../RoomView";
import { createStore } from "redux";
import { connect } from "react-redux";
export const initialState = {
  roomViews: [
    { num: "35", occupancy: "hold" },
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

const Select = ({ floors }) => {
  return (
    <div>
      <h2>Welcome to the Hotel California</h2>
      <h3>Pick a room:</h3>
      {floors.map(floor => (
        <div class="floor">
          {floor.map(room => (
            <RoomView {...room} />
          ))}
        </div>
      ))}
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

export default connect(mapStateToProps)(Select);
