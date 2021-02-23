import React, { Fragment } from "react";
import { format } from "date-fns";
import { Grid, Segment, Header, List, Item, Icon } from "semantic-ui-react";

const UserDetailedAbout = ({profile }) => {
  return (
    <Fragment>
      <Grid.Column width={12}>
        <Segment>
          <Grid columns={2}>
            <Grid.Column width={10}>
              <Header icon="smile" content={`About ${profile.displayName}`} />
              <p>
                I am a: <strong>{profile.occupation}</strong>
              </p>
              <p>
                Originally from <strong>{profile.origin}</strong>
              </p>
              <p>
                Member Since: <strong>{profile.createdAt &&
                  format(profile.createdAt.toDate(), "MM/dd/YYYY", {
                    awareOfUnicodeTokens: true
                  })}</strong>
                
              </p>
              <p>Description of user</p>
            </Grid.Column>
            <Grid.Column width={6}>
              <Header icon="heart outline" content="Interests" />
              <List>
                {profile.interests &&
                  profile.interests.length > 0 &&
                  profile.interests.map(interest => (
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
    </Fragment>
  );
};

export default UserDetailedAbout;
