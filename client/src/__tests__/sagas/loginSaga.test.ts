import { takeLatest } from 'redux-saga/effects';
import { LOGIN_SUCCESS } from '../../actions/authTypes';
import loginSaga from '../../sagas/loginSaga';
import { loginRequest } from '../../sagas/loginSaga';
import axios from 'axios';
import { runSaga } from 'redux-saga';

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
    
    let dispatched: unknown[] = [];
    const action = { 
        type: 'LOGIN' as const,
        payload: {
            username: 'njones',
            password: 'Pa$$.123'
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
                accessToken: 'access-token', 
                expiresAt: expirationTime, 
                refreshToken: 'refresh-token' 
            } 
        };
        const axiosPostSpy = jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve(response));

        await runSaga({
            dispatch: (action) => { dispatched.push(action); }
        }, loginRequest as any, action).toPromise(); // eslint-disable-line
        
        expect(axiosPostSpy).toHaveBeenCalledTimes(1);
        
        expect(localStorage.setItem).toHaveBeenCalledWith('access-token', 'access-token');
        expect(localStorage.setItem).toHaveBeenCalledWith('expires-at', expirationTime.toString());
        expect(localStorage.setItem).toHaveBeenCalledWith('refresh-token', 'refresh-token');
        
        expect(dispatched).toEqual([{
            payload:{
                username: 'njones',
            },
            type: LOGIN_SUCCESS,
        }]);

        axiosPostSpy.mockClear();
    });


    test('should call api and dispatch failure action', async () => {
        const error = {
            response: { 
                data:{
                    errors: [
                        { message: 'Invalid credentials' }
                    ]
                }
            } 
        };
        const axiosPostSpy = jest.spyOn(axios, 'post').mockRejectedValue(error);


        await runSaga({
            dispatch: (action) => { dispatched.push(action); }
        }, loginRequest as any, action).toPromise(); // eslint-disable-line

        expect(axiosPostSpy).toHaveBeenCalledTimes(1);

        expect(dispatched).toEqual([{
            type: 'LOGIN_FAILURE',
            payload: [
                { message: 'Invalid credentials' }
            ]
        }]);

        axiosPostSpy.mockClear();
    });
});