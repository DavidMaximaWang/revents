import {combineReducers} from 'redux'
import {reducer as FormReducer} from 'redux-form';
import testReducer from '../../features/testarea/testReducers'
import eventReducer from '../../features/event/eventReducer'
import modalReducer from '../../features/modals/modalReducer';
import authReducer from '../../features/auth/authReducer';
import asyncReducer from '../../features/async/asyncReducer';
import {reducer as ToastrReducer} from 'react-redux-toastr'

const rootReducer = combineReducers({
    test: testReducer,
    events: eventReducer,
    form:FormReducer,
    modals:modalReducer,
    auth: authReducer,
    async: asyncReducer,
    toastr: ToastrReducer
});

export default rootReducer;