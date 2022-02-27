import axios from 'axios';
import { call, takeLatest, put, CallEffect, PutEffect } from 'redux-saga/effects';
import { RefreshToken, REFRESH_TOKEN_FAILURE, REFRESH_TOKEN_REQUEST, REFRESH_TOKEN_SUCCESS } from '../actions/authTypes';

function* refreshTokenRequest(action: RefreshToken): Generator<CallEffect | PutEffect, void, { data: { token: string, expiresAt: number } }>{
    console.log('refreshTokenRequest');
    try{
        const response = yield call(axios.post, '/auth/token', action.payload, {
            headers: { 
                'Content-Type': 'application/json', 
                'X-Auth-Token': localStorage.getItem('refresh-token')! 
            } 
        });
        localStorage.setItem('access-token', response.data.token);
        localStorage.setItem('expires-at', response.data.expiresAt.toString());
        yield put({ type: REFRESH_TOKEN_SUCCESS });
    }
    catch(err){
        yield put({ type: REFRESH_TOKEN_FAILURE });
    }
}

export default function* refreshTokenSaga() {
    yield takeLatest(REFRESH_TOKEN_REQUEST, refreshTokenRequest);
}