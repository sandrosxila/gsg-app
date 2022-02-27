import axios from 'axios';
import { call, CallEffect, put, PutEffect, takeLatest } from 'redux-saga/effects';
import { FetchUser, FETCH_USER, SET_USER } from '../actions/userTypes';

export function* fetchUser(action: FetchUser): Generator<CallEffect | PutEffect, void, { data: { _id: string, fullName: string, username: string } }> {
    const { data: { _id: id, fullName, username } } = yield call(axios.get, `/users/${action.payload}`);

    yield put({ type: SET_USER, payload: { id, fullName, username } });
}

export default function* fetchUserSaga() {
    yield takeLatest(FETCH_USER, fetchUser);
}