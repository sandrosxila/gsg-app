import { combineReducers } from 'redux';
import AuthReducer, { IAuth } from './AuthReducer';
import UserReducer, { IUser } from './UserReducer';

export type RootState = {
    auth: IAuth,
    user: IUser
};

export default combineReducers({
    auth: AuthReducer,
    user: UserReducer
});