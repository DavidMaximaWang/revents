import { INCREMENT_COUNTER, DECREMENT_COUNTER } from "./testContstants";
import { createReducer } from "../../app/common/util/reducerUtils";

const initialState = {
  data: 42
};
const incrementCounter = (state)=>{
    return { ...state, data: state.data + 1 };
}

const decrementCounter = (state)=>{
    return { ...state, data: state.data - 1 };
}


export default createReducer(initialState, {
  [INCREMENT_COUNTER]: incrementCounter,
  [DECREMENT_COUNTER]: decrementCounter
});