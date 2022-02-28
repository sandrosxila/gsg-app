import React from 'react';
import { screen, render } from '@testing-library/react';
import user from '@testing-library/user-event';
import Login from '../../components/auth/Login';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store';
import { render as reduxRender } from '../../utils/test-utils';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));


describe('<Login/>', () => {

    describe('validation', () => {
        beforeEach(() => {
            render(
                <MemoryRouter>
                    <Provider store={ store }>
                        <Login />
                    </Provider>
                </MemoryRouter>
            );
        });
    
        test('shows required fields', () => {
            const username = screen.getByLabelText('User Name:');
            const password = screen.getByLabelText('Password:');
    
            expect(username).toBeInTheDocument();
            expect(password).toBeInTheDocument();
        });
    
    
        test('shows error message on submit for empty username and password', async () => {
            const submitBtn = screen.getByRole('button', { name: /submit/i });
    
            user.click(submitBtn);
    
            const usernameErrorMessage = await screen.findByText(/Please Fill Your Username/i);
            const passwordErrorMessage = await screen.findByText(/Please Fill Your Password/i);
    
            expect(usernameErrorMessage).toBeInTheDocument();
            expect(passwordErrorMessage).toBeInTheDocument();
        });
    });

    describe('navigation', () => { 

        const initialState = {
            auth: {
                user: {
                    username: '',
                },
                isUserLoggedIn: true,
                errors: [],
            },
            user: {
                id: '',
                fullName: '',
                username: ''
            }
        };    

        beforeEach(() => {
            reduxRender(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>,
                {
                    preloadedState: initialState
                }
            );
        });

        test('redirects to home page if user is logged in', () => {
            expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
        });
    });

});