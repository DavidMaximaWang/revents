import React, { Component } from "react";
import { connect } from "react-redux";
import { incrementAsync, decrementAsync } from "./testAction";
import { Button } from "semantic-ui-react";
import TestPlaceInput from "./TestPlaceInput";
import SimpleMap from "./SimpleMap";
import { openModal } from "../modals/modalActions";

const mapState = state => ({
  data: state.test.data,
  loading: state.async.loading,
  buttonName: state.async.elementName
});

const actions = {
  //mapDispatchToProps
  incrementAsync,
  decrementAsync,
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
    const {
      data,
      incrementAsync,
      decrementAsync,
      openModal,
      loading,
      buttonName
    } = this.props;
    return (
      <div>
        <h1> component test </h1>
        <h3>The answer is: {data}</h3>
        <Button
          name="Increment"
          loading={buttonName==="Increment" && loading}
          onClick={(e)=>incrementAsync(e.target.name)}
          positive
          content="Increment"
        />
        <Button
          name="Decrement"
          loading={buttonName==="Decrement" && loading}
          onClick={(e)=>decrementAsync(e.target.name)}
          negative
          content="Decrement"
        />
        <Button
          onClick={() => openModal("TestModal", { data: 42 })}
          color="teal"
          content="Open Modal"
        />
        <br />
        <br />
        <TestPlaceInput handleLtLng={this.handleLtLng} />
        <SimpleMap key={this.state.ltlng.lng} ltlng={this.state.ltlng} />
      </div>
    );
  }
}
export default connect(
  mapState,
  actions
)(TestComponent);
