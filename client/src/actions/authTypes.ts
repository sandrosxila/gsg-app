import { IAuth } from '../reducers/AuthReducer';

export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const REFRESH_TOKEN_SUCCESS = 'REFRESH_TOKEN_SUCCESS';
export const REFRESH_TOKEN_REQUEST = 'REFRESH_TOKEN_REQUEST';
export const REFRESH_TOKEN_FAILURE = 'REFRESH_TOKEN_FAILURE';

export const LOGOUT = 'LOGOUT';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';


export type Login = {
    type: typeof LOGIN,
    payload: {
        username: string,
        password: string,
    }
};

export type LoginSuccess = {
    type: typeof LOGIN_SUCCESS,
    payload: IAuth['user']
}

export type LoginFailure = {
    type: typeof LOGIN_FAILURE,
    payload: IAuth['errors']
}

export type LoginAction = LoginSuccess | LoginFailure;

export type RefreshTokenSuccess = {
    type: typeof REFRESH_TOKEN_SUCCESS
}

export type RefreshTokenFailure = {
    type: typeof REFRESH_TOKEN_FAILURE
}

export type RefreshToken = {
    type: typeof REFRESH_TOKEN_REQUEST,
    payload: {
        username: string,
    }
}

export type RefreshTokenAction = RefreshTokenSuccess | RefreshTokenFailure;

export type Logout = {
    type: typeof LOGOUT
}

export type LogoutRequest = {
    type: typeof LOGOUT_REQUEST
}

export type LogoutAction = LogoutRequest;