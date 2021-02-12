import { INCREMENT_COUNTER, DECREMENT_COUNTER } from "./testContstants";

//Action dispatcher
export const incrementCounter = () => {
  return {
    type: INCREMENT_COUNTER
  };
};


export const decrementCounter = () => {
    return {
      type: DECREMENT_COUNTER
    };
  };
  