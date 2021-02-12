import React, { Component, Fragment } from "react";
import EventDashboard from "../../features/event/EventDashboard/EventDashboard";
import Navbar from "../../features/nav/Navbar/Navbar";
import { Container } from "semantic-ui-react";
import { Route, Switch, withRouter } from "react-router";
import HomePage from "../../features/home/HomePage";
import EventDetailedPage from "../../features/event/EventDetailed/EventDetailedPage";
import PeopleDashboard from "../../features/event/user/PeopleDashboard/PeopleDashboard";
import UserDetailedPage from "../../features/event/user/UserDetailed/UserDetailedPage";
import SettingsDashboard from "../../features/event/user/Settings/SettingsDashboard";
import EventForm from "../../features/event/EventForm/EventForm";
import TestComponent from "../../features/testarea/TestComponent";

class App extends Component {
  render() {
    return (
      <Fragment>
        <Route exact path="/" component={HomePage}></Route>
        <Route
          path="/(.+)"
          render={() => (
            <Fragment>
              <Navbar />
              <Container className="main">
                <Switch key={this.props.location.key}>
                  <Route exact path="/events/" component={EventDashboard}></Route>
                  <Route path="/events/:id" component={EventDetailedPage}></Route>
                  <Route path="/people/" component={PeopleDashboard}></Route>
                  <Route path="/profile/:id" component={UserDetailedPage}></Route>
                  <Route path="/settings/" component={SettingsDashboard}></Route>
                  <Route path={["/createEvent/", "/manage/:id"]} component={EventForm}></Route>
                  <Route path="/test/" component={TestComponent}></Route>
                </Switch>
                
              </Container>
            </Fragment>
          )}
        />
      </Fragment>
    );
  }
}

export default withRouter(App);
