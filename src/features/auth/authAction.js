import{SubmissionError}from 'redux-form'
import { SIGN_OUT_USER } from "./authconstant";
import { closeModal } from "../modals/modalActions";

export const login = creds => {
  return async (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(creds.email, creds.password);
      dispatch(closeModal());
    } catch (error) {
      console.log(error);
      throw new SubmissionError({_error: 'Login failed'});//make the error available for the form
    }
  };
};

export const logout = () => {
  return {
    type: SIGN_OUT_USER
  };
};
