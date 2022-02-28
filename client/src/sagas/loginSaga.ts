import { LOGIN, Login, LOGIN_FAILURE, LOGIN_SUCCESS } from '../actions/authTypes';
import axios from 'axios';
import { call, CallEffect, put, PutEffect, takeLatest } from 'redux-saga/effects';


export function* loginRequest(action: Login): Generator<CallEffect | PutEffect, void, { data: { accessToken: string, expiresAt: number, refreshToken: string } }> {
    try{
        const response = yield call(axios.post, '/auth/login', action.payload, { headers: { 'Content-Type': 'application/json' } });
        
        localStorage.setItem('access-token', response.data.accessToken);
        localStorage.setItem('expires-at', response.data.expiresAt.toString());
        localStorage.setItem('refresh-token', response.data.refreshToken);
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userData } = action.payload;

        yield put({ type: LOGIN_SUCCESS, payload: userData });
    }
    catch(error: any){ //eslint-disable-line
        yield put({ type: LOGIN_FAILURE, payload: error.response.data.errors });
    }
}

export default function* loginSaga(){
    yield takeLatest(LOGIN, loginRequest);
}
