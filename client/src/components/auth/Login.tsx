import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { LOGIN } from '../../actions/authTypes';
import { RootState } from '../../reducers';


const Login = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const location: { state: any } = useLocation();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors: formErrors } } = useForm<{ username: string, password: string }>({
        mode: 'onSubmit',
    });

    const { errors, isUserLoggedIn, user: { username } } = useSelector((state: RootState) => state.auth);

    const onSubmit = (data: { username: string, password: string }) => {
        if(Object.keys(formErrors).length === 0) {
            dispatch({ type: LOGIN, payload: data });
        }
    };

    useEffect(() => {
        if(isUserLoggedIn){ 
            localStorage.setItem('user', JSON.stringify({ username }));
            navigate('/');
        }
    }, [navigate, isUserLoggedIn, username]);

    return (
        <LoginForm onSubmit={ handleSubmit(onSubmit) }>
            <LoginFormTitle>
                Log In
            </LoginFormTitle>
            <span>{location?.state?.message}</span>
            <label htmlFor="username" hidden>User Name:</label>
            <input id="username" type="text" placeholder="User Name" { ...register('username', { required: 'Please Fill Your Username' }) } />
            <span>
                {formErrors.username?.message}
            </span>

            <label htmlFor="password" hidden>Password:</label>
            <input id="password" type="password" placeholder="Password" { ...register('password', { required: 'Please Fill Your Password' }) }/>

            <span>
                {formErrors.password?.message}
            </span>
            {
                errors.map((error, index) => {
                    return <span key={ index }>{ error.message }</span>;
                })
            }

            <input type="submit" />

            <Link to='/register'>
                {'If you don\'t have an account, please register here'}
            </Link>
        </LoginForm>
    );
};

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
`;

const LoginFormTitle = styled.h2`
    font-size: 1.5rem;
    padding: 0.5rem;
`;

export default Login;