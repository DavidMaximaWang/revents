import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid } from "semantic-ui-react";
import EventDetailedHeader from "./EventDetailedHeader";
import EventDetailedInfo from "./EventDetailedInfo";
import EventDetailedChat from "./EventDetailedChat";
import EventDetailedSidebar from "./EventDetailedSidebar";
import { withFirestore } from "react-redux-firebase";
import { toastr } from "react-redux-toastr";
import { objectToArray } from "../../../app/common/util/helpers";

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
  return { event };
};
//convert to component to use the react life cycle method;
class EventDetailedPage extends Component {
  async componentDidMount() {
    const { firestore, match, history } = this.props;
    let event = await firestore.get(`events/${match.params.id}`);
    console.log(event);
    if (!event.exists) {
      history.push("/events");
      toastr.error("Sorry", "Event not found");
    }
  }

  render() {
    const { event } = this.props;
    const attendees =
      event && event.attendees && objectToArray(event.attendees);
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventDetailedHeader event={event} />
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

export default withFirestore(connect(mapState)(EventDetailedPage));
