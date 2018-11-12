const { createStore } = require("redux");
const initialState = {
  room: [],
  occupancy: []
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    // get all rooms at once, Promise-style
    case "loadRooms":
      return {
        ...state,
        room: action.payload
      };
    // get a single {num, occupancy} payload, where num is the key
    case "setOccupancy":
      const { occupancy, num } = action.payload;
      return {
        ...state,
        occupancy: {
          ...state.occupancy,
          [num]: occupancy
        }
      };
    default:
      return state;
  }
};

export const store = createStore(
  reducer,
  typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__()
);
