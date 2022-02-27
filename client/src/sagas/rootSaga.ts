import { all } from 'redux-saga/effects';
import fetchUserSaga from './fetchUserSaga';
import loginSaga from './loginSaga';
import logoutSaga from './logoutSaga';
import refreshTokenSaga from './refreshTokenSaga';

export default function* rootSaga() {
    yield all([
        loginSaga(),
        logoutSaga(),
        refreshTokenSaga(),
        fetchUserSaga()
    ]);
}