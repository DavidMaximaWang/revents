import React, { Component } from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import { NavLink, withRouter } from "react-router-dom";
import SignedOutMenus from "../Menus/SignedOutMenus";
import SignedInMenus from "../Menus/SignedInMenus";

class Navbar extends Component {
  state = {
    authenticated: false
  };
  handleSignIn = () => this.setState({ authenticated: true });
  handleSignOut = () => {
    this.setState({ authenticated: false });
    this.props.history.push("/");
  };
  render() {
    const { authenticated } = this.state;
    return (
      <Menu inverted fixed="top">
        <Container>
          <Menu.Item as={NavLink} exact to="/" header>
            <img src="assets/logo.png" alt="logo" />
            Re-vents
          </Menu.Item>
          <Menu.Item as={NavLink} to="/events" name="Events" />
          <Menu.Item as={NavLink} to="/people" name="People" />
          <Menu.Item as={NavLink} to="/createEvent">
            <Button floated="right" positive inverted content="Create Event" />
          </Menu.Item>
          {authenticated ? (
            <SignedInMenus signOut={this.handleSignOut} />
          ) : (
            <SignedOutMenus signIn={this.handleSignIn} />
          )}
        </Container>
      </Menu>
    );
  }
}
export default withRouter(Navbar);
