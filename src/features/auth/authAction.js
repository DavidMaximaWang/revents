import { SubmissionError } from "redux-form";
import { closeModal } from "../modals/modalActions";
import { firestore } from "firebase";

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
      throw new SubmissionError({ _error: "Login failed" });
      //make the error available for the form
    }
  };
};

export const registerUser = user => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    try {
      let createdUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password);
      console.log(createdUser);
      await createdUser.user.updateProfile({
        displayName: user.displayName
      }); //update firestore profile not auth profile!!
      let newUser = {
        displayName: user.displayName,
        createdAt: firestore.FieldValue.serverTimestamp()
      };
      await firestore.set(`users/${createdUser.user.uid}`, { ...newUser });
      dispatch(closeModal());
    } catch (error) {
      console.log(error);
      throw new SubmissionError({ _error: error.message });
      //make the error available for the form
    }
  };
};
