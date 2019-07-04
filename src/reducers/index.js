import {combineReducers} from 'redux';

import sessionReducer, {AUTH_USER_SET}from './sessions';
import usersReducer, {USERS_SET, USER_SET} from './users';
import messagesReducer, {MESSAGES_SET, MESSAGES_LIMIT_SET} from './messages';

const rootReducer = combineReducers({
    sessionState:sessionReducer,
    userState: usersReducer,
    messageState:messagesReducer,
});

export default rootReducer;
export  {AUTH_USER_SET, USERS_SET, USER_SET,  MESSAGES_LIMIT_SET, MESSAGES_SET};