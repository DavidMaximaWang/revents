import React, { Fragment } from "react";
import { Grid, Segment, Header, Image, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";

const UserDetailedPhotos = ({ photos }) => {
  return (
    <Fragment>
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
            {photos.map((photo, index) => (
              <Image key={index} src={photo.url} />
            ))}
          </Image.Group>
        </Segment>
      </Grid.Column>
    </Fragment>
  );
};

export default UserDetailedPhotos;
