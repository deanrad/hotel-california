import { connect } from "react-redux";
import React from "react";
import { Floor, chunkIntoFloors } from "./Select";

const MiniMap = ({ roomViews }) => (
  <div style={{ float: "right" }}>
    {chunkIntoFloors(roomViews).map(floor => (
      <Floor mini={true}>{floor}</Floor>
    ))}
  </div>
);

const Reserve = ({ roomViews, roomChoice, payment, loyalty }) => [
  <MiniMap roomViews={roomViews} />,
  <div>
    <h1>Reserving room {roomChoice}</h1>
    <div>
      <h2>Payment</h2>
      <input placeholder="0000 1111 2222" />
    </div>
    <div>
      <h2>Loyalty</h2>
      <input placeholder="Gold 12345" />
    </div>
    <br />
    <div>
      <button>Cancel</button>
      <button>Submit</button>
    </div>
  </div>
];
export default connect(({ roomViews, ...rest }) => ({
  ...rest,
  roomViews: roomViews.map(
    roomView =>
      roomView.num === "20" ? { ...roomView, occupancy: "hold mine" } : roomView
  )
}))(Reserve);
