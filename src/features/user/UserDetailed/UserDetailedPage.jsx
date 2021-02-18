import React, { Component } from "react";
import { connect } from "react-redux";

import { firestoreConnect } from "react-redux-firebase";

import { Grid } from "semantic-ui-react";
import { compose } from "redux";
import UserDetailedHeader from "./UserDetailedHeader";
import UserDetailedAbout from "./UserDetailedAbout";
import UserDetailedPhotos from "./UserDetailedPhotos";
import UserDetailedEvents from "./UserDetailedEvents";

const mapState = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
  photos: state.firestore.ordered.photos
});

const query = ({ auth }) => {
  return [
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "photos" }],
      storeAs: "photos"
    }
  ];
};

class UserDetailedPage extends Component {
  render() {
    const { profile, photos } = this.props;
    return (
      <Grid>
        <UserDetailedHeader profile={profile} />
        <UserDetailedAbout profile={profile} />
        <UserDetailedPhotos photos={photos} />
        <UserDetailedEvents profile={profile} />
      </Grid>
    );
  }
}

export default compose(
  connect(mapState),
  firestoreConnect(auth => query(auth))
)(UserDetailedPage);
