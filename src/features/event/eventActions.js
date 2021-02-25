import { toastr } from "react-redux-toastr";
import { createNewEvent } from "../../app/common/util/helpers";
import firebase from '../../app/config/firebase';
import { FETCH_EVENTS } from "./eventConstants";
import { asyncActionStart, asyncActionFinish, asyncActionError } from "../async/asyncActions";

export const createEvent = event => {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    const user = firebase.auth().currentUser;
    const photoURL = getState().firebase.profile.photoURL;
    const newEvent = createNewEvent(user, photoURL, event); //comibne photo, user to event
    try {
      let createdEvent = await firestore.add("events", newEvent);
      await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
        eventId: createdEvent.id,
        userUid: user.uid,
        eventDate: event.date,
        host: true
      });
      toastr.success("Success", "Event has been created");
      return createdEvent;
    } catch (error) {
      toastr.error("Oops", "Someting is wrong");
    }
  };
};

export const updateEvent = event => {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    try {
      await firestore.update(`events/${event.id}`, event);

      toastr.success("Success", "Event has been updated");
    } catch (error) {
      toastr.error("Oops", "Someting is wrong");
    }
  };
};

export const cancelEventToggle = (eventId, cancelled) => {
  console.log(eventId, cancelled);
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const message = cancelled
      ? "Are ou sure to cancel the event?"
      : "This will reactive the event, are you sure?";
    try {
      toastr.confirm(message, {
        onOk: async () => {
          firestore.update(`events/${eventId}`, {
            cancelled: cancelled
          });
        }
      });

      toastr.success("Success", "Event has been canceled");
    } catch (error) {
      toastr.error("Oops", "Someting is wrong");
    }
  };
};


export const getEventsForDashboard = lastEvent => async (
  dispatch,
  getState
) => {
  let today = new Date();
  const firestore = firebase.firestore(); //connect directly to firestore
  const eventsRef = firestore.collection("events");

  try {
    let query;
    dispatch(asyncActionStart());
    let startAfter =
      lastEvent &&
      (await eventsRef
        .doc(lastEvent.id)
        .get());
    query = lastEvent
      ? eventsRef
          .where("date", ">=", today)
          .orderBy("date")
          .startAfter(startAfter)
          .limit(2)
      : eventsRef
          .where("date", ">=", today)
          .orderBy("date")
          .limit(2);

    let querySnap = await query.get();
    if (!querySnap.docs.length) {
      dispatch(asyncActionFinish());
      return querySnap;
    }

    let events = [];
    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };
      // let evt = {...querySnap.docs[i].data()}
      events.push(evt);
    }
    dispatch({ type: FETCH_EVENTS, payload: { events } });
    dispatch(asyncActionFinish());
    return querySnap;
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};

export const addEventComment = (eventId, values, parentId) => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  const user = firebase.auth().currentUser;
  const profile = getState().firebase.profile;
  let newComment = {
    // parentId: parentId,
    displayName: profile.displayName,
    photoURL: profile.photoURL ||'assets/user.png',
    uid :user.uid,
    text : values.comment,
    date : Date.now()
  };

  try {
    await firebase.push(`event_chat/${eventId}`, newComment);
  } catch (error) {
    console.log(error);
    toastr.error("Oops", "Problem adding comment");
  }
};