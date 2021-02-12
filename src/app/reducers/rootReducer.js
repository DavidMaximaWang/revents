import {combineReducers} from 'redux'
import testReducer from '../../features/testarea/testReducers'

const rootReducer = combineReducers({
    test: testReducer
})

export default rootReducer;