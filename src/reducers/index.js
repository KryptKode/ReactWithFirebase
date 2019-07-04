import {combineReducers} from 'redux';

import sessionReducer from './sessions';
import usersReducer from './users';
import messagesReducer from './messages';

const rootReducer = combineReducers({
    sessionState:sessionReducer,
    userState: usersReducer,
    messageState:messagesReducer,
});

export default rootReducer;