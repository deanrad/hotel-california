const { createStore } = require("redux");
const initialState = {
  rooms: [
    { num: "30" },
    { num: "31" },
    { num: "20" },
    { num: "21" },
    { num: "10" },
    { num: "11" }
  ],
  occupancy: {
    "10": "full",
    "11": "open",
    "20": "open",
    "21": "open",
    "30": "open",
    "31": "hold"
  }
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    // get all rooms at once, Promise-style
    case "loadRooms":
      return {
        ...state,
        room: action.payload
      };
    case "holdRoom":
      const { hold } = action.payload;
      return {
        ...state,
        occupancy: {
          ...state.occupancy,
          [action.payload.num]: hold ? "hold" : "open"
        }
      };
    default:
      return state;
  }
};

module.exports = {
  store: createStore(reducer),
  initialState: {}
};
