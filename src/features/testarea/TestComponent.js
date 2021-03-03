import React, { Component } from "react";
import { connect } from "react-redux";
import { incrementAsync, decrementAsync } from "./testAction";
import { Button, Header } from "semantic-ui-react";
import TestPlaceInput from "./TestPlaceInput";
import SimpleMap from "./SimpleMap";
import { openModal } from "../modals/modalActions";
import { toastr } from "react-redux-toastr";
import firebase from "../../app/config/firebase";

const myTestUserId = "EOp6LDZL7lgIthX4KHNKMUpARx53";
const mapState = state => ({
  data: state.test.data,
  loading: state.async.loading,
  buttonName: state.async.elementName
});

const actions = {
  //mapDispatchToProps
  incrementAsync,
  decrementAsync,
  openModal
};

class TestComponent extends Component {
  state = {
    ltlng: {
      lat: 59.95,
      lng: 30.33
    }
  };
  handleLtLng = ltlng => {
    this.setState(() => ({
      ltlng: ltlng
    }));
  };
  handleTestUpdateProfile = async () => {
    const firestore = firebase.firestore();
    // doc = test's userUid
    let userDocRef = await firestore.collection("users").doc(myTestUserId);
    try {
      await userDocRef.update({ displayName: "testing" });
      toastr.success("Success");
    } catch (error) {
      console.log(error);
      toastr.error("Computer says no");
    }
  };

  handleCreateTestEvent = async () => {
    const firestore = firebase.firestore();
    let eventDocRef = await firestore.collection("events").doc("DELETEME");
    try {
      await eventDocRef.set({
        title: "DELETEME"
      });
      toastr.success("Success");
    } catch (error) {
      console.log(error);
      toastr.error("Computer says no");
    }
  };

  handleTestJoinEvent = async () => {
    const firestore = firebase.firestore();
    let eventDocRef = await firestore.collection("events").doc("DELETEME");
    const attendee = {
      photoURL: "/assets/user.png",
      displayName: "Testing"
    };
    try {
      await eventDocRef.update({
        [`attendees.${myTestUserId}`]: attendee
      });
      toastr.success("Success");
    } catch (error) {
      console.log(error);
      toastr.error("Computer says no");
    }
  };

  handleTestCancelGoingToEvent = async () => {
    const firestore = firebase.firestore();
    let eventDocRef = await firestore.collection("events").doc("DELETEME");
    try {
      await eventDocRef.update({
        [`attendees.${myTestUserId}`]: firebase.firestore.FieldValue.delete()
      });
      toastr.success("Success");
    } catch (error) {
      console.log(error);
      toastr.error("Computer says no");
    }
  };

  handleTestChangeAttendeePhotoInEvent = async () => {
    const firestore = firebase.firestore();
    let eventDocRef = await firestore.collection("events").doc("DELETEME");
    try {
      await eventDocRef.update({
        [`attendees.${myTestUserId}.photoURL`]: "testing123.jpg"
      });
      toastr.success("Success");
    } catch (error) {
      console.log(error);
      toastr.error("Computer says no");
    }
  };
  render() {
    const {
      data,
      incrementAsync,
      decrementAsync,
      openModal,
      loading,
      buttonName
    } = this.props;
    return (
      <div>
        <h1> component test </h1>
        <h3>The answer is: {data}</h3>
        <Button
          name="Increment"
          loading={buttonName === "Increment" && loading}
          onClick={e => incrementAsync(e.target.name)}
          positive
          content="Increment"
        />
        <Button
          name="Decrement"
          loading={buttonName === "Decrement" && loading}
          onClick={e => decrementAsync(e.target.name)}
          negative
          content="Decrement"
        />
        <Button
          onClick={() => openModal("TestModal", { data: 42 })}
          color="teal"
          content="Open Modal"
        />
        <br />
                <br />
                <Header as='h2' content='Permissions tests' />
                <Button
                  onClick={this.handleCreateTestEvent}
                  color='blue'
                  fluid
                  content='Test create event - should fail if anon'
                />
                <Button
                  onClick={this.handleTestUpdateProfile}
                  color='orange'
                  fluid
                  content='Test update dianas profile - should fail if anon/not diana - should succeed if diana'
                />
                <Button
                  onClick={this.handleTestJoinEvent}
                  color='olive'
                  fluid
                  content='Test joining an event - should fail if anon/not diana - should succeed if diana'
                />
                <Button
                  onClick={this.handleTestCancelGoingToEvent}
                  color='purple'
                  fluid
                  content='Test cancelling attendance to an event - should fail if anon/not diana - should succeed if diana'
                />
                <Button
                  onClick={this.handleTestChangeAttendeePhotoInEvent}
                  color='violet'
                  fluid
                  content='Test changing photo for event attendee - should fail if anon/not diana - should succeed if diana'
                />
                <br />
                <br />
        <br />
        <br />
        <TestPlaceInput handleLtLng={this.handleLtLng} />
        <SimpleMap key={this.state.ltlng.lng} ltlng={this.state.ltlng} />
      </div>
    );
  }
}
export default connect(
  mapState,
  actions
)(TestComponent);
