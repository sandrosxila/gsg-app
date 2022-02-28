import { takeLatest } from 'redux-saga/effects';
import logoutSaga, { logoutRequest } from '../../sagas/logoutSaga';
import axios from 'axios';
import { runSaga } from 'redux-saga';

describe('logout', () => {
    const genLogoutSaga = logoutSaga();

    test('should wait for latest LOGOUT action and call logoutRequest', () => {
        expect(genLogoutSaga.next().value).toEqual(takeLatest('LOGOUT', logoutRequest));
    });
    
});

describe('logoutRequest', () => {
    
    let dispatched: unknown[] = [];

    beforeAll(() => {
        jest.spyOn(window.localStorage.__proto__, 'removeItem');
        window.localStorage.__proto__.setItem = jest.fn();
    });

    beforeEach(() => {
        dispatched = [];
    });

    test('should call api and dispatch success action', async () => {
        const axiosPostSpy = jest.spyOn(axios, 'delete').mockImplementation(() => Promise.resolve());

        await runSaga({
            dispatch: (action) => { dispatched.push(action); }
        }, logoutRequest as any).toPromise(); // eslint-disable-line
        
        expect(axiosPostSpy).toHaveBeenCalledTimes(1);
        
        expect(localStorage.removeItem).toHaveBeenCalledWith('access-token');
        expect(localStorage.removeItem).toHaveBeenCalledWith('expires-at');
        expect(localStorage.removeItem).toHaveBeenCalledWith('refresh-token');
        expect(localStorage.removeItem).toHaveBeenCalledWith('user');
        
        expect(dispatched).toEqual([{
            type: 'LOGOUT_REQUEST',
        }]);

        axiosPostSpy.mockClear();
    });
});