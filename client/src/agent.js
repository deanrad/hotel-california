import { store } from "./store";
import { Agent } from "antares-protocol";

export const agent = new Agent();

// Send all actions through the store
agent.addFilter(({ action }) => store.dispatch(action));

// Export this function
export const process = (action, context) => {
  agent.process(action, context);
};
