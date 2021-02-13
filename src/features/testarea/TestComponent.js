import React, { Component } from 'react';
import {connect} from 'react-redux';
import {incrementCounter, decrementCounter} from './testAction';
import { Button } from 'semantic-ui-react';
import TestPlaceInput from './TestPlaceInput';

const mapState = (state)=>({
    data: state.test.data
});

const actions = {//mapDispatchToProps
  incrementCounter, decrementCounter
}
 class TestComponent extends Component {
    
    render() {
        const {data, incrementCounter, decrementCounter}= this.props;
        return (
          <div>
            <h1> component test </h1>
            <h3>The answer is: {data}</h3>
            <Button onClick={incrementCounter} positive content='Increment'/>
            <Button onClick={decrementCounter} negative content='Decrement'/>
            <br/>
            <br/>
            <TestPlaceInput/>
          </div>
        );
    }
}
export default connect(mapState, actions)(TestComponent);