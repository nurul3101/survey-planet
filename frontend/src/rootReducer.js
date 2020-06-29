import { combineReducers } from 'redux'
import signupReducer from './Containers/Signup/reducer'

const rootReducer = combineReducers({
  signupReducer,
})

export default rootReducer
