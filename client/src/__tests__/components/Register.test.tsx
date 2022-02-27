import React from 'react';
import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Register from '../../components/auth/Register';
import Login from '../../components/auth/Login';
import { render as reduxRender } from '../../utils/test-utils';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));


describe('<Register/>', () => {

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

    describe('validation', () => { 
        beforeEach(() => {
            reduxRender(
                <MemoryRouter>
                    <Register />
                </MemoryRouter>,
                { preloadedState: initialState }
            );
        });
    
        test('shows required fields', () => {
            const fullName = screen.getByLabelText('Full Name:');
            const username = screen.getByLabelText('User Name:');
            const password = screen.getByLabelText('Password:');
    
            expect(fullName).toBeInTheDocument();
            expect(username).toBeInTheDocument();
            expect(password).toBeInTheDocument();
        });
    
        test('shows error message on submit for empty username, full name and password', async () => {
    
            const submitBtn = screen.getByRole('button', { name: /submit/i });
    
            user.click(submitBtn);
    
            const fullNameErrorMessage = await screen.findByText(/Please Enter Your Full Name/i);
            const usernameErrorMessage = await screen.findByText(/Please Enter Your User Name/i);
            const passwordErrorMessage = await screen.findByText(/You must specify a password/i);
    
            expect(fullNameErrorMessage).toBeInTheDocument();
            expect(usernameErrorMessage).toBeInTheDocument();
            expect(passwordErrorMessage).toBeInTheDocument();
        });
    
        test('shows error message on incorrect password', async () => {
    
            const password = screen.getByLabelText('Password:');
    
            user.type(password, '1234');
    
            const passwordErrorMessage = await screen.findByText(/Password must have at least 8 characters/i);
    
            expect(passwordErrorMessage).toBeInTheDocument();
    
            user.type(password, '12345678');
            const longPasswordErrorMessage = await screen.findByText(/Password should contain uppercase, lowercase, special character and number/i);
            expect(longPasswordErrorMessage).toBeInTheDocument();
        });
    });

    describe('navigation', () => { 

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