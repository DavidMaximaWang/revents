import { toastr } from "react-redux-toastr";
import { createNewEvent } from "../../app/common/util/helpers";

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

