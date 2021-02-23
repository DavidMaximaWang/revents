import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import EventList from "../EventList/EventList";
import { getEventsForDashboard} from "../eventActions";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import EventActivity from "../EventActivity/EventActivity";
import { firestoreConnect } from "react-redux-firebase";

const mapState = state => ({
  //map state to props
  events: state.events,
  loading: state.async.loading
});
const actions = {
  getEventsForDashboard
};

class EventDashboard extends Component {
  componentDidMount(){
    this.props.getEventsForDashboard();
  }
  render() {
    const { events, loading } = this.props;
    if (loading) {
      return <LoadingComponent />;
    }
    console.log("there are ",events.length, "events")
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
