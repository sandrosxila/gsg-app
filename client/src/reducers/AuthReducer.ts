import { LogoutAction, LOGOUT_REQUEST, RefreshTokenAction, REFRESH_TOKEN_FAILURE, REFRESH_TOKEN_SUCCESS } from './../actions/authTypes';
import { LOGIN_SUCCESS, LOGIN_FAILURE, LoginAction } from '../actions/authTypes';

export interface IAuth {
    user: {
        username: string;
    },
    isUserLoggedIn: boolean,
    errors: { message: string }[]
}

const initialState: IAuth = {
    user: localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user')!) : JSON.stringify({ username: '' }),
    isUserLoggedIn: !!localStorage.getItem('access-token') && !!localStorage.getItem('refresh-token') &&
        Number(localStorage.getItem('expires-at') || 0) * 1000 >= Date.now(),
    errors: [],
};

export type AuthAction = LoginAction | RefreshTokenAction | LogoutAction;

export default function (state = initialState, action: AuthAction) {
    switch (action.type) {
    case LOGIN_SUCCESS:
        return {
            ...state,
            user: action.payload,
            isUserLoggedIn: true,
            errors: []
        };
    case LOGIN_FAILURE:
        return {
            ...state,
            user: {
                username: '',
            },
            isUserLoggedIn: false,
            errors: [...action.payload]
        };
    case REFRESH_TOKEN_SUCCESS:
        return {
            ...state,
            isUserLoggedIn: true
        };
    case REFRESH_TOKEN_FAILURE:
        return {
            ...state,
            isUserLoggedIn: false
        };
    case LOGOUT_REQUEST:
        return {
            user: {
                username: ''
            },
            isUserLoggedIn: false,
            errors: []
        };
    default:
        return state;
    }
}