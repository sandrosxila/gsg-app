import axios from 'axios';
import { runSaga } from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';
import fetchUserSaga, { fetchUser } from '../../sagas/fetchUserSaga';

describe('fetchUserSaga', () => {
    const genFetchUserSaga = fetchUserSaga();

    test('should wait for latest FETCH_USER action and call fetchUser', () => {
        expect(genFetchUserSaga.next().value).toEqual(takeLatest('FETCH_USER', fetchUser));
    });

    test('should be done on next iteration', () => {
        expect(genFetchUserSaga.next().done).toBeTruthy();
    });
});

describe('fetchUser', () => {
    let dispatched: unknown[] = [];

    const action = {
        type: 'FETCH_USER' as const,
        payload: 'njones'
    };

    beforeEach(() => {
        dispatched = [];
    });

    test('should get user data and dispatch user data', async () => {
        const response = {
            data:{
                _id: '123',
                fullName: 'John Doe',
                username: 'jdoe'
            }
        };
        
        const axiosGetSpy = jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve(response));

        await runSaga({
            dispatch: (action) => { dispatched.push(action); }
        }, fetchUser as any, action).toPromise(); // eslint-disable-line

        expect(axiosGetSpy).toHaveBeenCalledTimes(1);

        expect(dispatched).toEqual([{
            type: 'SET_USER',
            payload: {
                id: '123',
                fullName: 'John Doe',
                username: 'jdoe'
            }
        }]);
        axiosGetSpy.mockClear();
    });
});