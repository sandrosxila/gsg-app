import { call, takeLatest } from 'redux-saga/effects';
import { Login } from '../../actions/authTypes';
import loginSaga from '../../sagas/loginSaga';
import { loginRequest } from '../../sagas/loginSaga';
import axios from 'axios';

describe('loginSaga', () => {
    const genLoginSaga = loginSaga();

    test('should wait for latest Login action and call loginRequest', () => {
        expect(genLoginSaga.next().value).toEqual(takeLatest('LOGIN', loginRequest));
    });

    test('should be done on next iteration', () => {
        expect(genLoginSaga.next().done).toBeTruthy();
    });
});

describe('loginRequest', () => {
    const getLoginRequest = loginRequest({ payload: { username: 'test', password:'Te$t.123321' } } as Login);
    // let axiosPostSpy: jest.SpyInstance;
    // let localStorageSpy: jest.SpyInstance;
    let expirationTime: number;
    let response: { data: { accessToken: string, expiresAt: number, refreshToken: string } };
    beforeEach(() => {
        response = {
            data: { 
                accessToken: 'access-token', 
                expiresAt: expirationTime, 
                refreshToken: 'refresh-token' 
            } 
        };
        expirationTime = Date.now();
    });

    test('should call axios.post with correct params', () => {
        expect(getLoginRequest.next(response).value)
            .toEqual(call(axios.post, '/auth/login', { username: 'test', password: 'Te$t.123321' }, { headers: { 'Content-Type': 'application/json' } }));
    });

});