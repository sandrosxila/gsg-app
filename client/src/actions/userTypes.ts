import { IAuth } from '../reducers/AuthReducer';
import { IUser } from '../reducers/UserReducer';

export const FETCH_USER = 'FETCH_USER';
export const SET_USER = 'SET_USER';

export type SetUser = {
    type: typeof SET_USER,
    payload: IUser,
}

export type FetchUser = {
    type: typeof FETCH_USER,
    payload: IAuth['user']['username'],
}