import React, { Component } from "react";
import { connect } from "react-redux";
import differenceInCalendarYears from "date-fns/differenceInCalendarYears";
import {
  Button,
  Card,
  Grid,
  Header,
  Icon,
  Image,
  Item,
  List,
  Menu,
  Segment
} from "semantic-ui-react";
import { Link } from "react-router-dom";

const mapState = state => ({
  user: state.firebase.profile,
  photos: state.firestore.ordered.photos
});

class UserDetailedPage extends Component {
  getAge = user => {
    if (!user.isLoaded) return -1;
    try {
      const age = differenceInCalendarYears(
        Date.now(),
        user.dateOfBirth.toDate()
      );
      return age;
    } catch (error) {
      console.log(error);
      return -1;
    }
  };
  getDate = user => {
    try {
      const since = user.isLoaded && user.createdAt.toDate();
      return since;
    } catch (error) {
      console.log(error);
      return -1;
    }
  };
  render() {
    const { user, photos } = this.props;
    return (
      <Grid>
        <Grid.Column width={16}>
          <Segment>
            <Item.Group>
              <Item>
                <Item.Image avatar size="small" src={user.photoURL} />
                <Item.Content verticalAlign="bottom">
                  <Header as="h1">{user.displayName}</Header>
                  <br />
                  <Header as="h3">Occupation</Header>
                  <br />
                  <Header as="h3">
                    {this.getAge(user)}, {user.city}
                  </Header>
                </Item.Content>
              </Item>
            </Item.Group>
          </Segment>
        </Grid.Column>
        <Grid.Column width={12}>
          <Segment>
            <Grid columns={2}>
              <Grid.Column width={10}>
                <Header icon="smile" content={`About ${user.displayName}`} />
                <p>
                  I am a: <strong>{user.occupation}</strong>
                </p>
                <p>
                  Originally from <strong>{user.origin}</strong>
                </p>
                <p>
                  Member Since: <strong>{`${this.getDate(user)}`}</strong>
                </p>
                <p>Description of user</p>
              </Grid.Column>
              <Grid.Column width={6}>
                <Header icon="heart outline" content="Interests" />
                <List>
                  {user.interests &&
                    user.interests.length > 0 &&
                    user.interests.map(interest => (
                      <Item key={interest}>
                        <Icon name="heart" />
                        <Item.Content>{interest}</Item.Content>
                      </Item>
                    ))}
                </List>
              </Grid.Column>
            </Grid>
          </Segment>
        </Grid.Column>
        <Grid.Column width={4}>
          <Segment>
            <Button
              as={Link}
              to="/settings"
              color="teal"
              fluid
              basic
              content="Edit Profile"
            />
          </Segment>
        </Grid.Column>

        <Grid.Column width={12}>
          <Segment attached>
            <Header icon="image" content="Photos" />

            <Image.Group size="small">
              {photos && photos.map(photo => <Image src={photo.url} />)}
            </Image.Group>
          </Segment>
        </Grid.Column>

        <Grid.Column width={12}>
          <Segment attached>
            <Header icon="calendar" content="Events" />
            <Menu secondary pointing>
              <Menu.Item name="All Events" active />
              <Menu.Item name="Past Events" />
              <Menu.Item name="Future Events" />
              <Menu.Item name="Events Hosted" />
            </Menu>

            <Card.Group itemsPerRow={5}>
              <Card>
                <Image src={"/assets/categoryImages/drinks.jpg"} />
                <Card.Content>
                  <Card.Header textAlign="center">Event Title</Card.Header>
                  <Card.Meta textAlign="center">
                    28th March 2018 at 10:00 PM
                  </Card.Meta>
                </Card.Content>
              </Card>

              <Card>
                <Image src={"/assets/categoryImages/drinks.jpg"} />
                <Card.Content>
                  <Card.Header textAlign="center">Event Title</Card.Header>
                  <Card.Meta textAlign="center">
                    28th March 2018 at 10:00 PM
                  </Card.Meta>
                </Card.Content>
              </Card>
            </Card.Group>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default connect(mapState)(UserDetailedPage);
