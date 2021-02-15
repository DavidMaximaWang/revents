import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Menu, Container, Button } from "semantic-ui-react";
import { NavLink, withRouter } from "react-router-dom";
import SignedOutMenus from "../Menus/SignedOutMenus";
import SignedInMenus from "../Menus/SignedInMenus";
import { openModal } from "../../modals/modalActions";
import { logout } from "../../auth/authAction";

const actions = {
  openModal,
  logout
};

const mapState = state => {
  return {
    auth: state.auth //state registered in rootReducer as auth
  };
};

class Navbar extends Component {
  handleSignIn = () => {
    this.props.openModal("LoginModal");
  };
  handleRegister = () => {
    this.props.openModal("RegisterModal");
  };
  handleSignOut = () => {
    this.props.logout();
    this.props.history.push("/");
  };
  render() {
    const { auth } = this.props;
    const authenticated = auth.authenticated;
    return (
      <Menu inverted fixed="top">
        <Container>
          <Menu.Item as={NavLink} exact to="/" header>
            <img src="/assets/logo.png" alt="logo" />
            {/* here use /assets/logo.png instead of assets/logo.png, otherwise logo sometime unresolved */}
            Re-vents
          </Menu.Item>
          <Menu.Item as={NavLink} exact to="/events" name="Events" />
          {authenticated && (
            <Fragment>
              <Menu.Item as={NavLink} to="/people" name="People" />
              <Menu.Item as={NavLink} to="/test" name="Test" />
              <Menu.Item as={NavLink} to="/createEvent">
                <Button
                  floated="right"
                  positive
                  inverted
                  content="Create Event"
                />
              </Menu.Item>
            </Fragment>
          )}

          {authenticated ? (
            <SignedInMenus
              signOut={this.handleSignOut}
              currentUser={auth.currentUser}
            />
          ) : (
            <SignedOutMenus
              signIn={this.handleSignIn}
              register={this.handleRegister}
            />
          )}
        </Container>
      </Menu>
    );
  }
}
export default withRouter(
  connect(
    mapState,
    actions
  )(Navbar)
);
