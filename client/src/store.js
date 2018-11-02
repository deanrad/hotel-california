const { createStore } = require("redux");
const initialState = {
  room: [
    { num: "30" },
    { num: "31" },
    { num: "20" },
    { num: "21" },
    { num: "10" },
    { num: "11" }
  ],
  occupancy: [
    { num: "30", occupancy: "hold" },
    { num: "31", occupancy: "hold" },
    { num: "20", occupancy: "open" },
    { num: "21", occupancy: "full" },
    { num: "10", occupancy: "full" },
    { num: "11", occupancy: "open" }
  ]
};

const reducer = (state = { room: [], occupancy: [] }, action) => {
  switch (action.type) {
    case "loadRooms":
      return {
        room: action.payload,
        occupancy: state.occupancy
      };
    case "setOccupancy":
      const newOcc = Array.from(state.occupancy);
      newOcc.push(action.payload);
      return {
        room: state.room,
        occupancy: newOcc
      };
    default:
      return state;
  }
};

const store = createStore(
  reducer,
  typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__()
);
module.exports = {
  initialState,
  store
};
