/* global google */
import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Segment, Form, Button, Grid, Header } from "semantic-ui-react";
import { createEvent, updateEvent, cancelEventToggle } from "../eventActions";
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";
import DateInput from "../../../app/common/form/DateInput";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from "revalidate";
import PlaceInput from "../../../app/common/form/PlaceInput";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { withFirestore } from "react-redux-firebase";
import { toastr } from "react-redux-toastr";

const mapState = (state, ownProps) => {
  const eventId = ownProps.match.params.id;

  let event = {};

  if (state.firestore.ordered.events && state.firestore.ordered.events.length) {
    event =
      state.firestore.ordered.events.filter(event => event.id === eventId)[0] ||
      {};
  }
  return { initialValues: event, event };
};

const actions = {
  createEvent,
  updateEvent,
  cancelEventToggle
};
const validate = combineValidators({
  title: isRequired({ message: "The event title is required" }),
  category: isRequired({ message: "The category is required" }),
  description: composeValidators(
    isRequired("Please enter a description"),
    hasLengthGreaterThan(4)({
      message: "Description must have a length greater then 4"
    })
  )(),
  city: isRequired("city"),
  venue: isRequired("venue"),
  date: isRequired("date")
});

const category = [
  { key: "drinks", text: "Drinks", value: "drinks" },
  { key: "culture", text: "Culture", value: "culture" },
  { key: "film", text: "Film", value: "film" },
  { key: "food", text: "Food", value: "food" },
  { key: "music", text: "Music", value: "music" },
  { key: "travel", text: "Travel", value: "travel" }
];

class EventForm extends Component {
  state = {
    cityLatLng: {},
    venueLatLng: {}
  };

  async componentDidMount() {
    const { firestore, match, history } = this.props;
    let event = await firestore.get(`events/${match.params.id}`);

    if (!event.exists) {
      history.push("/events");
      toastr.error("Sorry", "Event not found");
    } else {
      this.setState({
        venueLatLng: event.data().venueLatLng
      });
    }
  }

  onFormSubmit = async values => {
    try {
      values.venueLatLng = this.state.venueLatLng;
      if (this.props.initialValues.id) {
        this.props.updateEvent(values);
        this.props.history.push(`/events/${this.props.initialValues.id}`);
      } else {
        let createdEvent = this.props.createEvent(values);
        this.props.history.push(`/events/${createdEvent.id}`);
      }
    } catch (error) {
      console.log(error);
    }
    // console.log(this.state);//ref is available as we are using 'Component'
  };

  handleCitySelect = selectedCity => {
    geocodeByAddress(selectedCity)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          cityLatLng: latlng
        });
      })
      .then(() => {
        this.props.change("city", selectedCity);
      });
  };
  handleVenueSelect = selectedVenu => {
    geocodeByAddress(selectedVenu)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          venueLatLng: latlng
        });
      })
      .then(() => {
        this.props.change("venue", selectedVenu);
      });
  };
  handleInputChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value
    });
  };
  render() {
    const {
      history,
      initialValues,
      invalid,
      submitting,
      pristine,
      event,
      cancelEventToggle
    } = this.props;
    return (
      <Grid>
        <Grid.Column width={10}>
          <Segment>
            <Header sub color="teal" content="Event Details" />
            <Form
              onSubmit={this.props.handleSubmit(this.onFormSubmit)}
              autoComplete="off"
            >
              <Field
                name="title"
                component={TextInput}
                placeholder=" Event title"
              />
              <Field
                name="category"
                component={SelectInput}
                multiple={false}
                options={category}
                placeholder=" Give your event a name"
              />
              <Field
                name="description"
                component={TextArea}
                rows={3}
                placeholder="What is your event about?"
              />
              <Header sub color="teal" content="Event Location Details" />
              <Field
                name="city"
                component={PlaceInput}
                options={{ types: ["(cities)"] }}
                onSelect={this.handleCitySelect}
                placeholder=" Event city"
              />
              <Field
                name="venue"
                component={PlaceInput}
                options={{
                  location: new google.maps.LatLng(this.state.cityLatLng),
                  radius: 10000,
                  types: ["establishment"]
                }}
                onSelect={this.handleVenueSelect}
                placeholder=" Event venue"
              />
              <Field
                name="date"
                component={DateInput}
                dateFormat="dd  LLL yyyy h:mm a"
                showTimeSelect
                timeFormat="HH:mm"
                placeholder=" Event date"
              />

              <Button
                disabled={invalid || submitting || pristine}
                positive
                type="submit"
              >
                Submit
              </Button>
              <Button
                onClick={
                  initialValues.id
                    ? () => history.push(`/events/${initialValues.id}`)
                    : () => history.push("/events/")
                }
                type="button"
              >
                {/*//todo  history.goBack can go to history of other website, may consider other option */}
                Cancel
              </Button>

              <Button
                onClick={() => cancelEventToggle(event.id, !event.cancelled)}
                type="button"
                floated="right"
                color={event.cancelled ? "green" : "red"}
                content={event.cancelled ? "Reactive event" : "CancelEvent"}
              ></Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}
export default withFirestore(
  connect(
    mapState,
    actions
  )(
    reduxForm({ form: "eventForm", validate, enableReinitialize: true })(
      EventForm
    )
  )
);
