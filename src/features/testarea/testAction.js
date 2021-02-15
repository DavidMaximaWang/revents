import { INCREMENT_COUNTER, DECREMENT_COUNTER } from "./testContstants";
import { asyncActionStart, asyncActionFinish } from "../async/asyncActions";

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
  
  //fake delay
  const delay = (ms)=>{
    return new  Promise(resolve =>setTimeout(resolve, ms));
  }

  export const incrementAsync =()=>{
    return async dispatch =>{
      dispatch(asyncActionStart());
      await delay(1000);
      dispatch(incrementCounter());
      dispatch(asyncActionFinish());

    }
  }
  export const decrementAsync =()=>{
    return async dispatch =>{
      dispatch(asyncActionStart());
      await delay(1000);
      dispatch({type: DECREMENT_COUNTER});
      dispatch(asyncActionFinish());

    }
  }