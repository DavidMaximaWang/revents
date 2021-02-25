import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid } from "semantic-ui-react";
import EventDetailedHeader from "./EventDetailedHeader";
import EventDetailedInfo from "./EventDetailedInfo";
import EventDetailedChat from "./EventDetailedChat";
import EventDetailedSidebar from "./EventDetailedSidebar";
import { withFirestore, firebaseConnect, isEmpty } from "react-redux-firebase";
import {compose} from 'redux'
import { objectToArray } from "../../../app/common/util/helpers";
import { joinEvent, cancelJoinEvent } from "../../user/userActions";
import {addEventComment} from '../eventActions';

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
  return { event, auth: state.firebase.auth,
  eventChat: !isEmpty(state.firebase.data.event_chat)&& objectToArray(state.firebase.data.event_chat[ownProps.match.params.id])
};
};

const actions={
joinEvent,
cancelJoinEvent,
addEventComment,
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
    const { event , auth, joinEvent, cancelJoinEvent, addEventComment, eventChat} = this.props;
    const attendees =
      event && event.attendees && objectToArray(event.attendees);
      const isHost = event.hostUid === auth.uid;//current user is hosting this event?
      const isGoing = attendees && attendees.some(a => a.id ===auth.uid);

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventDetailedHeader event={event} isGoing={isGoing} isHost = {isHost} joinEvent= {joinEvent} cancelJoinEvent={cancelJoinEvent}/>
          <EventDetailedInfo event={event} />
          <EventDetailedChat addEventComment={addEventComment} eventId={event.id} eventChat = {eventChat}/>
        </Grid.Column>
        <Grid.Column width={6}>
          <EventDetailedSidebar attendees={attendees} />
        </Grid.Column>
      </Grid>
    );
  }
}

export default compose(
  withFirestore,
  connect(
    mapState,
    actions
  ),
  firebaseConnect(props => [`event_chat/${props.match.params.id}`])
)(EventDetailedPage);
