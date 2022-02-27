import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers';

type RegisterFormData = {
    fullName: string,
    username: string,
    password: string
};

const Register = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        mode: 'onChange',
    });

    const { isUserLoggedIn } = useSelector((state: RootState) => state.auth);

    const [serverErrors, setServerErrors] = useState<{ message: string }[]>([]);

    const postRegisterData = async (data: RegisterFormData) => {
        try {
            const response = await axios.post('/auth/register', data);
            if (response.data.errors) {
                setServerErrors(response.data.errors);
            }
            else {
                navigate('/', { state: { message: 'You have successfully registered. Please login.' } });
            }
        }
        catch (error: any) { // eslint-disable-line
            setServerErrors(error.response.data.errors);
        }
    };


    const onSubmit = (data: { fullName: string, username: string, password: string }) => {
        if (Object.keys(errors).length === 0) {
            postRegisterData(data);
        }
    };

    useEffect(() => {
        if (isUserLoggedIn) {
            navigate('/');
        }
    }, [navigate, isUserLoggedIn]);

    return (
        <RegisterForm onSubmit={ handleSubmit(onSubmit) }>
            <RegisterFormTitle>
                Register
            </RegisterFormTitle>

            <label htmlFor="fullName" hidden>Full Name:</label>
            <input id="fullName" type="text" placeholder="Full Name" { ...register('fullName', { required: 'Please Enter Your Full Name' }) } />
            <span>{errors.fullName?.message}</span>

            <label htmlFor="username" hidden>User Name:</label>
            <input
                id="username"
                type="text"
                placeholder="User Name"
                {
                    ...register(
                        'username',
                        {
                            required: 'Please Enter Your User Name',
                            pattern: {
                                value: /^[a-zA-Z0-9]+$/g,
                                message: 'Username should contain uppercase, lowercase characters or digits'
                            }
                        }
                    )
                }
            />
            <span>{errors.username?.message}</span>

            <label htmlFor="password" hidden>Password:</label>
            <input
                id="password"
                type="password"
                placeholder="Password"
                {
                    ...register(
                        'password',
                        {
                            required: 'You must specify a password',
                            minLength: {
                                value: 8,
                                message: 'Password must have at least 8 characters'
                            },
                            maxLength: 100,
                            pattern: {
                                value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/g,
                                message: 'Password should contain uppercase, lowercase, special character and number'
                            }
                        }
                    )
                }
            />
            <span>{errors.password?.message}</span>
            {
                serverErrors.map((error, index) => {
                    return <span key={ index }>{error.message}</span>;
                })
            }

            <input type="submit" />
        </RegisterForm>
    );
};

const RegisterForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
`;

const RegisterFormTitle = styled.h2`
    font-size: 1.5rem;
    padding: 0.5rem;
`;

export default Register;