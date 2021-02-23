import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid } from "semantic-ui-react";
import EventDetailedHeader from "./EventDetailedHeader";
import EventDetailedInfo from "./EventDetailedInfo";
import EventDetailedChat from "./EventDetailedChat";
import EventDetailedSidebar from "./EventDetailedSidebar";
import { withFirestore } from "react-redux-firebase";
import { objectToArray } from "../../../app/common/util/helpers";
import { joinEvent, cancelJoinEvent } from "../../user/userActions";

const mapState = (state, ownProps) => {
  //router properties are attached to the component as its own properties
  //any components own properties will be able to access by a second parameter
  const eventId = ownProps.match.params.id;
  console.log(eventId);
  let event = {};
  if (state.firestore.ordered.events && state.firestore.ordered.events.length) {
    event =
      state.firestore.ordered.events.filter(event => event.id === eventId)[0] ||
      {};
  }
  return { event, auth: state.firebase.auth};
};

const actions={
joinEvent,
cancelJoinEvent
}
//convert to component to use the react life cycle method;
class EventDetailedPage extends Component {

  async componentDidMount() {
    const { firestore, match } = this.props;
    await firestore.setListener(`events/${match.params.id}`);
    
  }
  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }

  render() {
    const { event , auth, joinEvent, cancelJoinEvent} = this.props;
    const attendees =
      event && event.attendees && objectToArray(event.attendees);
      const isHost = event.hostUid === auth.uid;//current user is hosting this event?
      const isGoing = attendees && attendees.some(a => a.id ===auth.uid);

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventDetailedHeader event={event} isGoing={isGoing} isHost = {isHost} joinEvent= {joinEvent} cancelJoinEvent={cancelJoinEvent}/>
          <EventDetailedInfo event={event} />
          <EventDetailedChat />
        </Grid.Column>
        <Grid.Column width={6}>
          <EventDetailedSidebar attendees={attendees} />
        </Grid.Column>
      </Grid>
    );
  }
}

export default withFirestore(connect(mapState, actions)(EventDetailedPage));
