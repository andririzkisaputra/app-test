import { combineReducers } from 'redux';
import User from './user';
import Reload from './reload';
export default reducer = combineReducers({
  user         : User,
  reload       : Reload,
});
