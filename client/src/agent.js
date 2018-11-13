import { store } from "./store";

export const process = (action, context) => {
  store.dispatch(action);
};
