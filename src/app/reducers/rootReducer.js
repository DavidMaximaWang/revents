import {combineReducers} from 'redux'
import {reducer as FormReducer} from 'redux-form';
import testReducer from '../../features/testarea/testReducers'
import eventReducer from '../../features/event/eventReducer'
import modalReducer from '../../features/modals/modalReducer';
import authReducer from '../../features/auth/authReducer';

const rootReducer = combineReducers({
    test: testReducer,
    events: eventReducer,
    form:FormReducer,
    modals:modalReducer,
    auth: authReducer
});

export default rootReducer;