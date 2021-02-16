import { createStore, applyMiddleware } from "redux";
import { reactReduxFirebase, getFirebase } from "react-redux-firebase";
import { reduxFirestore, getFirestore } from "redux-firestore";
import rootReducer from "../reducers/rootReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import firebase from "../config/firebase";

const rrfConfig = {
  userProfile: "users",
  attachAuthIsReady: true, //wait until authentication is ready for users
  useFirestoreForProfile: true // use firestore instead of firebase for profile
}; //react redux firebase config, 

export const configureStore = () => {
  const middlewares = [thunk.withExtraArgument({ getFirebase, getFirestore })];
  //thunk call an asynchronous function in our app before action is being dispatched

  const composedEnhancer = composeWithDevTools(
    applyMiddleware(...middlewares),
    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase)
  );//todo
  const store = createStore(rootReducer, composedEnhancer);
  //dont need devToolsEnhancer any more it is included in composedEnhancer

  return store;
};
