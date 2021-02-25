import React, { Fragment } from "react";
import { Grid, Segment, Header, Image, Card, Tab } from "semantic-ui-react";
import { format } from 'date-fns';
import { Link } from "react-router-dom";

const panes = [
  {menuItem: 'All Events', pane: {key: 'allEvents'}},
  {menuItem: 'Past Events', pane: {key: 'allEvents'}},
  {menuItem: 'Future Events', pane: {key: 'allEvents'}},
  {menuItem: 'Hosting Events', pane: {key: 'allEvents'}},
];
//todo implement paging for this part
const UserDetailedEvents = ({eventsLoading, events, changeTab}) => {

  return (
    <Fragment>
      <Grid.Column width={12}>
        <Segment attached loading = {eventsLoading}>
          <Header icon="calendar" content="Events" />
          <Tab onTabChange={(e, data)=>changeTab(e, data)} panes = {panes} menu = {{second: true, point: true}}></Tab>
          <br/>

          <Card.Group itemsPerRow={5}>
            {events && 
            events.map(event=>{
             return (
               <Card as={Link} to={`/events/${event.id}`} key={event.id}>
                 <Image src={`/assets/categoryImages/${event.category}.jpg`} />
                 <Card.Content>
                   <Card.Header textAlign="center">{event.title}</Card.Header>
                   <Card.Meta textAlign="center">
                     <div>
                       {format(event.date && event.date.toDate(), "dd LL yyyy")}
                       
                     </div>
                     <div>
                       {format(event.date && event.date.toDate(), "h:mm a")}
                     </div>

                   </Card.Meta>
                 </Card.Content>
               </Card>
             );
            })}
          </Card.Group>
        </Segment>
      </Grid.Column>
    </Fragment>
  );
};

export default UserDetailedEvents;
