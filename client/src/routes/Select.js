import React from "react";
import RoomView from "../RoomView";
import { connect } from "react-redux";

export const chunkIntoFloors = roomViews => {
  const floors = [];
  for (let i = 0; i < roomViews.length; i += 2) {
    floors.push([roomViews[i], roomViews[i + 1]]);
  }
  return floors;
};

// Formats for the UI component
export const createRoomViews = state => {
  const { room, occupancy } = state;
  return room.map(room => {
    const occ = occupancy.find(o => o.num === room.num);
    return {
      ...room,
      occupancy: occ ? occ.occupancy : "open"
    };
  });
};

export const mapStateToProps = state => {
  const roomViews = createRoomViews(state);
  const floors = chunkIntoFloors(roomViews);
  return { floors };
};

export const Floor = ({ mini, children: rooms }) => (
  <div className="floor">
    {rooms.map(room => (
      <RoomView key={room.num} {...{ ...room, mini }} />
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
