const { createStore } = require("redux");
const initialState = {
  roomViews: [
    { num: "30", occupancy: "hold" },
    { num: "31", occupancy: "hold" },
    { num: "20", occupancy: "open" },
    { num: "21", occupancy: "full" },
    { num: "10", occupancy: "full" },
    { num: "11", occupancy: "open" }
  ]
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "loadRooms":
      return {
        roomViews: action.payload
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
