import React, { Component } from "react";
import { connect } from "react-redux";
import { incrementCounter, decrementCounter } from "./testAction";
import { Button } from "semantic-ui-react";
import TestPlaceInput from "./TestPlaceInput";
import SimpleMap from "./SimpleMap";
import {openModal} from '../modals/modalActions';

const mapState = state => ({
  data: state.test.data
});

const actions = {
  //mapDispatchToProps
  incrementCounter,
  decrementCounter,
  openModal
};

class TestComponent extends Component {
  state = {
    ltlng: {
      lat: 59.95,
      lng: 30.33
    }
  };
  handleLtLng = ltlng => {
    this.setState(() => ({
      ltlng: ltlng
    }));
  };
  render() {
    const { data, incrementCounter, decrementCounter, openModal } = this.props;
    return (
      <div>
        <h1> component test </h1>
        <h3>The answer is: {data}</h3>
        <Button onClick={incrementCounter} positive content="Increment" />
        <Button onClick={decrementCounter} negative content="Decrement" />
        <Button onClick={()=>openModal('TestModal',{data:42})} color='teal' content="Open Modal" />
        <br />
        <br />
        <TestPlaceInput
          
          handleLtLng={this.handleLtLng}
        />
        <SimpleMap key ={this.state.ltlng.lng} ltlng={this.state.ltlng}/>
      </div>
    );
  }
}
export default connect(
  mapState,
  actions
)(TestComponent);
