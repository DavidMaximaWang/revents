import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import EventList from "../EventList/EventList";
import { createEvent, updateEvent } from "../eventActions";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import EventActivity from "../EventActivity/EventActivity";
import { firestoreConnect } from "react-redux-firebase";

const mapState = state => ({
  //map state to props
  events: state.firestore.ordered.events,
  loading: state.async.loading
});
const actions = {
  createEvent,
  updateEvent,
};

class EventDashboard extends Component {
  state = {
    isOpen: false,
    selectedEvent: null
  };


  render() {
    const { events, loading } = this.props;
    if (loading) {
      return <LoadingComponent />;
    }
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList events={events}/>
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity />
        </Grid.Column>
      </Grid>
    );
  }
}

export default connect(
  mapState,
  actions
)(firestoreConnect([{ collection: "events" }])(EventDashboard));
