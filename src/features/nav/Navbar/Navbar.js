import React, { Component } from "react";
import {connect} from 'react-redux';
import { Menu, Container, Button } from "semantic-ui-react";
import { NavLink, withRouter } from "react-router-dom";
import SignedOutMenus from "../Menus/SignedOutMenus";
import SignedInMenus from "../Menus/SignedInMenus";
import {openModal} from '../../modals/modalActions'

const actions = {
  openModal,
}
class Navbar extends Component {
  state = {
    authenticated: false
  };
  handleSignIn = () => {
    this.props.openModal('LoginModal');
  };
  handleRegister = ()=>{
    this.props.openModal('RegisterModal')
  }
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
            <img src="/assets/logo.png" alt="logo" />
            {/* here use /assets/logo.png instead of assets/logo.png, otherwise logo sometime unresolved */}
            Re-vents
          </Menu.Item>
          <Menu.Item as={NavLink} exact to="/events" name="Events" />
          <Menu.Item as={NavLink} to="/people" name="People" />
          <Menu.Item as={NavLink} to="/test" name="Test" />
          <Menu.Item as={NavLink} to="/createEvent">
            <Button floated="right" positive inverted content="Create Event" />
          </Menu.Item>
          {authenticated ? (
            <SignedInMenus signOut={this.handleSignOut} />
          ) : (
            <SignedOutMenus signIn={this.handleSignIn}  register={this.handleRegister}/>
          )}
        </Container>
      </Menu>
    );
  }
}
export default withRouter(connect(null, actions)(Navbar));
