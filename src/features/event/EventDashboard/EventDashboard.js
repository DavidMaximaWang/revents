import React, { Component } from "react";
import { Grid, Button, Loader } from "semantic-ui-react";
import { connect } from "react-redux";
import EventList from "../EventList/EventList";
import { getEventsForDashboard } from "../eventActions";
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
  state = {
    moreEvents: false,
    loadedEvents: []
  };
  async componentDidMount() {
    let next = await this.props.getEventsForDashboard();
    console.log(next);
    if (next && next.docs && next.docs.length > 1) {
      this.setState({ moreEvents: true });
    }
  }
  componentDidUpdate(prevProp) {
    if (this.props.events !== prevProp.events) {
      this.setState({
        loadedEvents: [...this.state.loadedEvents, ...this.props.events]
      });
    }
  }

  getNextEvents = async () => {
    const { events } = this.props;
    let lastEvent = events && events[events.length - 1];
    let next = await this.props.getEventsForDashboard(lastEvent);

    if (next && next.docs && next.docs.length <= 1) {
      this.setState({ moreEvents: false });
    }
  };
  render() {
    const { loading } = this.props;
    const { loadedEvents, moreEvents } = this.state;
   
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList
            events={loadedEvents}
            loading={loading}
            moreEvents={moreEvents}
            getNextEvents={this.getNextEvents}
          />
        </Grid.Column>
        
        <Grid.Column width={6}>
          <EventActivity />
        </Grid.Column>
        <Grid.Column width={10}>
          <Loader active={loading} />
        </Grid.Column>
      </Grid>
    );
  }
}

export default connect(
  mapState,
  actions
)(firestoreConnect([{ collection: "events" }])(EventDashboard));
