import { toastr } from "react-redux-toastr";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../async/asyncActions";
import cuid from "cuid";
import firebase from "../../app/config/firebase";
import { FETCH_EVENTS } from "../event/eventConstants";

export const updateProfile = user => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  try {
    await firebase.updateProfile(user); //update profile in fire store, not auth
    toastr.success("Success", "Your profile has been updated");
  } catch (error) {
    console.log(error);
  }
};

export const uploadProfileImage = (file, fileName) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const imageName = cuid();
  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  const path = `${user.uid}/user_images`;
  const options = {
    name: imageName
  };
  try {
    dispatch(asyncActionStart());
    //task list:
    //upload file to filebase storage
    let uploadedFile = await firebase.uploadFile(path, file, null, options);
    // get url of  the image;
    let downloadURL = await uploadedFile.uploadTaskSnapshot.ref.getDownloadURL();
    // user document from  firestore
    let userDoc = await firestore.get(`users/${user.uid}`);
    //check if user has photo, if not update profile
    if (!userDoc.data().photoURL) {
      await firebase.updateProfile({
        photoURL: downloadURL
      });
      await user.updateProfile({
        photoURL: downloadURL
      });
    }

    // add image to firestore
    await firestore.add(
      {
        collection: "users",
        doc: user.uid,
        subcollections: [
          {
            collection: "photos"
          }
        ]
      },
      {
        name: imageName,
        url: downloadURL
      }
    );

    dispatch(asyncActionFinish());
    toastr.success("Success", "Your photo has been uploaded");
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};

export const deletePhoto = photo => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  try {
    await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);
    await firestore.delete({
      collection: "users",
      doc: user.uid,
      subcollections: [{ collection: "photos", doc: photo.id }]
    });
    toastr.success("Success", "Your profile has been updated");
  } catch (error) {
    console.log(error);
    throw new Error("Problem deleting the photo");
  }
};

export const setMainPhoto = photo => async (dispatch, getState) => {
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  const today = new Date();
  let userDocRef = firestore.collection("users").doc(user.uid);
  let eventAttendeeRef = firestore.collection("event_attendee");
  try {
    dispatch(asyncActionStart());
    let batch = firestore.batch();
    batch.update(userDocRef, {
      photoURL: photo.url
    });
    let eventQuery = await eventAttendeeRef
      .where("userUid", "==", user.uid)
      .where("eventDate", ">=", today);
    let eventQuerySnap = await eventQuery.get();
    for (let i = 0; i < eventQuerySnap.docs.length; i++) {
      let eventDocRef = await firestore
        .collection("events")
        .doc(eventQuerySnap.docs[i].data().eventId);
      let event = await eventDocRef.get();
      if (event.data().hostUid === user.uid) {
        batch.update(eventDocRef, {
          hostPhotoURL: photo.url,
          [`attendees.${user.uid}.photoURL`]: photo.url
        });
      } else {
        batch.update(eventDocRef, {
          [`attendees.${user.uid}.photoURL`]: photo.url
        });
      }
    }
    console.log(batch);
    await batch.commit();
    dispatch(asyncActionFinish());
    toastr.success("Success", "MainPhoto updated");
  } catch (error) {
    console.error(error);

    dispatch(asyncActionError());
    throw new Error("failed to set main photo");
  }
};

export const joinEvent = event => async (
  dispatch,
  getState,
  
) => {
  dispatch(asyncActionStart());
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  const profile = getState().firebase.profile;
  const attendee = {
    displayName: profile.displayName,
    going: true,
    host: false,
    joinDate: new Date(),
    photoURL: profile.photoURL || "/assets/user.png"
  };
  try {
    let eventDocRef= firestore.collection('events').doc(event.id);
    let eventAttendeeRef = firestore.collection('event_attendee').doc(`${event.id}_${user.uid}`);

    await firestore.runTransaction(async transaction => {
      await transaction.get(eventDocRef);
      await transaction.update(eventDocRef, {
        [`attendees.${user.uid}`]: attendee
      });
      await transaction.set(eventAttendeeRef, {
        eventDate: event.date,
        eventId: event.id,
        host: false,
        userUid: user.uid
      });
    });
    dispatch(asyncActionFinish());
    toastr.success("Success", "Joined event");
  } catch (error) {
    console.error(error);
    dispatch(asyncActionError());
    toastr.success("Oops", "Problems signing up to event");
  }
};
export const cancelJoinEvent = event => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;

  try {
    await firestore.update(`events/${event.id}`, {
      [`attendees.${user.uid}`]: firestore.FieldValue.delete()
    }); //delete a field
    await firestore.delete(`event_attendee/${event.id}_${user.uid}`);
    //delete entire docoment
    toastr.success("Success", "You will not go to this event");
  } catch (error) {
    console.error(error);
    throw new Error("Oops", "failed to  cancel join the event");
  }
};

export const getUserEvents = (userUid, activeTab) => async (
  dispatch,
  getState
) => {
  let today = new Date();
  const firestore = firebase.firestore();
  const eventsRef = firestore.collection("event_attendee");
  dispatch(asyncActionStart());
  let query;
    switch (activeTab) {
      case 1: //pastEvents
      query = eventsRef
          .where("userUid", "==", userUid)
          .where("eventDate", "<=", today)
          .orderBy("eventDate", "desc");
        break;
      case 2: //future events
      query = eventsRef
          .where("userUid", "==", userUid)
          .where("eventDate", ">", today)
          .orderBy("eventDate");
        break;
      case 3: //host events
      query =  eventsRef
          .where("userUid", "==", userUid)
          .where("host", "==", true)
          .orderBy("eventDate", "desc");
        break;
      default://all events
      query = eventsRef
          .where("userUid", "==", userUid)
          .orderBy("eventDate", "desc");
        break;
    }
  try {
    let querySnap = await query.get();
    let events = [];
    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt  =await firestore.collection('events').doc(querySnap.docs[i].data().eventId).get();
      events.push({id:evt.id, ...evt.data()});
    }
    dispatch({type: FETCH_EVENTS, payload: {events}})

    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};
