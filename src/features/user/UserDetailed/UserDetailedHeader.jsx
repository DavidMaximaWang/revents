import React, { Fragment } from "react";
import { Grid, Segment, Item, Header } from "semantic-ui-react";
import differenceInCalendarYears from "date-fns/differenceInCalendarYears";

const getAge = profile => {
  if (!profile.isLoaded) return -1;
  try {
    const age = differenceInCalendarYears(
      Date.now(),
      profile.dateOfBirth.toDate()
    );
    return age;
  } catch (error) {
    console.log(error);
    return "Unknown age";
  }
};
const UserDetailedHeader = ({ profile }) => {
  return (
    <Fragment>
      <Grid.Column width={16}>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image
                avatar
                size="small"
                src={profile.photoURL || "/assets/user.png"}
              />
              <Item.Content verticalAlign="bottom">
                <Header as="h1">{profile.displayName}</Header>
                <br />
                <Header as="h3">Occupation</Header>
                <br />
                <Header as="h3">
                  {getAge(profile)},{" "}
                  {`Lives in ${profile.city || "unknown city"}`}
                </Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Grid.Column>
    </Fragment>
  );
};

export default UserDetailedHeader;
