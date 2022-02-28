import axios from 'axios';
import { runSaga } from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';
import refreshTokenSaga, { refreshTokenRequest } from '../../sagas/refreshTokenSaga';

describe('refreshTokenSaga', () => {
    const genRefreshTokenSaga = refreshTokenSaga();
    

    test('should wait for latest RefreshToken action and call refreshTokenRequest', () => {
        expect(genRefreshTokenSaga.next().value).toEqual(takeLatest('REFRESH_TOKEN_REQUEST', refreshTokenRequest));
    });

    test('should be done on next iteration', () => {
        expect(genRefreshTokenSaga.next().done).toBeTruthy();
    });
});

describe('refreshTokenRequest', () => {
    let dispatched: unknown[] = [];

    const action = {
        type: 'REFRESH_TOKEN_REQUEST' as const,
        payload: {
            username: 'test'
        }
    };

    beforeAll(() => {
        jest.spyOn(window.localStorage.__proto__, 'setItem');
        window.localStorage.__proto__.setItem = jest.fn();
    });

    beforeEach(() => {
        dispatched = [];
    });

    test('should call api and dispatch success action', async () => {
        const expirationTime = Date.now() + (15 * 60 * 1000);
        const response = {
            data: {
                token: 'access-token',
                expiresAt: expirationTime,
            }
        };
        const axiosPostSpy = jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve(response));

        await runSaga({
            dispatch: (action) => { dispatched.push(action); }
        }, refreshTokenRequest as any, action).toPromise(); // eslint-disable-line

        expect(axiosPostSpy).toHaveBeenCalledTimes(1);

        expect(localStorage.setItem).toHaveBeenCalledWith('access-token', 'access-token');
        expect(localStorage.setItem).toHaveBeenCalledWith('expires-at', expirationTime.toString());

        expect(dispatched).toEqual([{
            type: 'REFRESH_TOKEN_SUCCESS'
        }]);
    });

    test('should call api and dispatch failure action', async () => {
        const error = new Error('test error');
        const axiosPostSpy = jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject(error));

        await runSaga({
            dispatch: (action) => { dispatched.push(action); }
        }, refreshTokenRequest as any, action).toPromise(); // eslint-disable-line

        expect(axiosPostSpy).toHaveBeenCalledTimes(1);

        expect(dispatched).toEqual([{
            type: 'REFRESH_TOKEN_FAILURE'
        }]);
    });

});