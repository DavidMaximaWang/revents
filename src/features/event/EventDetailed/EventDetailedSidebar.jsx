import React, { Fragment } from "react";
import { Segment, Item, Label, List } from "semantic-ui-react";

const EventDetailedSidebar = ({ attendees }) => {
  const isHost = false;
  return (
    <Fragment>
      <Segment
        textAlign="center"
        style={{ border: "none" }}
        attached="top"
        secondary
        inverted
        color="teal"
      >
        {attendees && attendees.length}{" "}
        {attendees && attendees.length === 1 ? " Person " : " People "} Going
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {attendees &&
            attendees.map(attendee => (
              <Item.Group key={attendee.id}>
                <Item style={{ position: "relative" }}>
                  {isHost && (
                    <Label
                      style={{ position: "absolute" }}
                      color="orange"
                      ribbon="right"
                    >
                      Host
                    </Label>
                  )}

                  <Item.Image size="tiny" src={attendee.photoURL} />
                  <Item.Content verticalAlign="middle">
                    <Item.Header as="h3">
                      <span>{attendee.displayName}</span>
                    </Item.Header>
                  </Item.Content>
                </Item>
              </Item.Group>
            ))}
        </List>
      </Segment>
    </Fragment>
  );
};

export default EventDetailedSidebar;
