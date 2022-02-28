import { LOGOUT_REQUEST } from './../actions/authTypes';
import { call, CallEffect, put, PutEffect, takeLatest } from 'redux-saga/effects';
import { LOGOUT } from '../actions/authTypes';
import axios from 'axios';

export function* logoutRequest(): Generator<CallEffect | PutEffect, void, void> {
    try{
        yield call(axios.delete, '/auth/logout', { headers: { 'X-Auth-Token': `${localStorage.getItem('refresh-token')}` } });
        localStorage.removeItem('access-token');
        localStorage.removeItem('refresh-token');
        localStorage.removeItem('expires-at');
        localStorage.removeItem('user');

        yield put({ type: LOGOUT_REQUEST });
    } catch(error) {
        console.log(error);
    }
}

export default function* logoutSaga(){
    yield takeLatest(LOGOUT, logoutRequest);
}