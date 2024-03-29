import React, { Fragment } from 'react'
import { Segment, Image, Item, Header, Button, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import {format} from 'date-fns';

//s_8.6.2 for style
const eventImageStyle = {
    filter: 'brightness(30%)'
};

const eventImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

const EventDetailedHeader = ({loading, event, isGoing, isHost, joinEvent, cancelJoinEvent, authenticated, openModal}) => {
    //s_8.6.1
    return (
      <Segment.Group>
        <Segment basic attached="top" style={{ padding: "0" }}>
          <Image
            src={`/assets/categoryImages/${event.category}.jpg`}
            fluid
            style={eventImageStyle}
          />

          <Segment basic style={eventImageTextStyle}>
            <Item.Group>
              <Item>
                <Item.Content>
                  <Header
                    size="huge"
                    content={event.title}
                    style={{ color: "white" }}
                  />
                  <p>
                    {event.date && format(event.date.toDate(), "EEEE do LLLL")}
                  </p>
                  <p>
                    Hosted by{" "}
                    <strong>
                      <Link
                        to={`/profile/${event.hostUid}`}
                        style={{ color: "white" }}
                      >
                        {event.hostedBy}
                      </Link>
                      {event.hostedBy}
                    </strong>
                  </p>
                </Item.Content>
              </Item>
            </Item.Group>
          </Segment>
        </Segment>

        <Segment attached="bottom" clearing>
          {/* clearing then the float manage button is in correct place */}
          {event.cancelled && <Label size ='large' color='red' content='This event has been cancelled'/>}
          {!isHost && (
            <Fragment>
              {isGoing && !event.cancelled && (
                <Button onClick={() => cancelJoinEvent(event)}>
                  Cancel My Place
                </Button>
              )}
              {!isGoing && authenticated && !event.cancelled && (
                <Button
                  loading={loading}
                  onClick={() => joinEvent(event)}
                  color="teal"
                >
                  JOIN THIS EVENT
                </Button>
              )}
              {
                !authenticated && !event.cancelled &&<Button
                  loading={loading}
                  onClick={() => openModal('UnauthModal')}
                  color="teal"
                >
                  JOIN THIS EVENT
                </Button>
              }
               
               
            </Fragment>
          )}
          {isHost && (
            <Fragment>
              <Button
                as={Link}
                to={`/manage/${event.id}`}
                color="orange"
                floated="right"
              >
                Manage Event
              </Button>
            </Fragment>
          )}
        </Segment>
      </Segment.Group>
    );
}

export default EventDetailedHeader
