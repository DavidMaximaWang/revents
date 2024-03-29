import React, { Component, createRef } from "react";
import { Grid, Loader } from "semantic-ui-react";
import { connect } from "react-redux";
import EventList from "../EventList/EventList";
import { getEventsForDashboard } from "../eventActions";
import EventActivity from "../EventActivity/EventActivity";
import { firestoreConnect } from "react-redux-firebase";

const query = [{
  collection : 'activity',
  orderBy: ['timestamp', 'desc'],
  limit: 5,
}];
const mapState = state => ({
  //map state to props
  events: state.events,
  loading: state.async.loading,
  activities: state.firestore.ordered.activity
});
const actions = {
  getEventsForDashboard
};

class EventDashboard extends Component {
  contextRef = createRef()
  state = {
    moreEvents: false,
    loadedEvents: []
  };
  async componentDidMount() {
    let next = await this.props.getEventsForDashboard();
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
    const { loading, activities } = this.props;
    const { loadedEvents, moreEvents } = this.state;
   
    return (
      <Grid>
        <Grid.Column width={10}>
          <div ref = {this.contextRef}>
             <EventList
            events={loadedEvents}
            loading={loading}
            moreEvents={moreEvents}
            getNextEvents={this.getNextEvents}
          />
          </div>
         
        </Grid.Column>
        
        <Grid.Column width={6}>
          <EventActivity activities = {activities} contextRef= {this.contextRef}/>
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
)(firestoreConnect(query)(EventDashboard));
