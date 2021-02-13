import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Segment, Form, Button, Grid, Header } from "semantic-ui-react";
import { createEvent, updateEvent } from "../eventActions";
import cuid from "cuid";
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


const mapState = (state, ownProps) => {
  const eventId = ownProps.match.params.id;

  let event = {};

  if (eventId && state.events.length > 0) {
    event = state.events.filter(event => event.id === eventId)[0];
  }
  return { initialValues: event };
};

const actions = {
  createEvent,
  updateEvent
};
const validate =combineValidators({
  title : isRequired({message:"The event title is required"}),
  category: isRequired({message: "The category is required"}),
  description: composeValidators(isRequired("Please enter a description"),
  hasLengthGreaterThan(4)({message:'Description must have a length greater then 4'}))(),
  city: isRequired('city'),
  venue: isRequired('venue'),
  date:isRequired('date')
})

const category = [
  { key: "drinks", text: "Drinks", value: "drinks" },
  { key: "culture", text: "Culture", value: "culture" },
  { key: "film", text: "Film", value: "film" },
  { key: "food", text: "Food", value: "food" },
  { key: "music", text: "Music", value: "music" },
  { key: "travel", text: "Travel", value: "travel" }
];

class EventForm extends Component {
  onFormSubmit = values => {
    if (this.props.initialValues.id) {
      this.props.updateEvent(values);
      this.props.history.push(`/events/${this.props.initialValues.id}`);
    } else {
      const newEvent = {
        ...values,
        id: cuid(),
        hostPhotoURL: "/assets/user.png",
        hostedBy: "Bob"
      };
      this.props.createEvent(newEvent);
      this.props.history.push(`/events/${newEvent.id}`);
    }

    // console.log(this.state);//ref is available as we are using 'Component'
  };
  handleInputChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value
    });
  };
  render() {
    const { history, initialValues, invalid, submitting, pristine } = this.props;
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
                placeholder=" Event city"
              />
              <Field
                name="venue"
                component={TextInput}
                placeholder=" Event venue"
              />
              <Field
                name="date"
                component={DateInput}
                dateFormat = 'dd  LLL yyyy h:mm a'
                showTimeSelect
                timeFormat='HH:mm'
                placeholder=" Event date"
              />

              <Button disabled ={invalid|| submitting || pristine }positive type="submit">
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
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}
export default connect(
  mapState,
  actions
)(reduxForm({ form: "eventForm", validate })(EventForm));
