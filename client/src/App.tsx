import React, { useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/auth/PrivateRoute';
import { useEffect } from 'react';
import { REFRESH_TOKEN_REQUEST } from './actions/authTypes';
import { useDispatch } from 'react-redux';

function App() {
    const dispatch = useDispatch();

    const expiresAt = Number(localStorage.getItem('expires-at'));

    const timer = useRef<NodeJS.Timer | null>(null);

    useEffect(() => {
        if (expiresAt) {
            if(timer.current) {
                clearInterval(timer.current);
            }
            timer.current = setInterval(() => {
                console.log('sending');

                if(expiresAt && expiresAt * 1000 < Date.now()) {
                    dispatch({ type: REFRESH_TOKEN_REQUEST });
                }
            }, Math.abs(expiresAt * 1000 - Date.now()));
        }
        
        return () => {
            if(timer.current) {
                clearInterval(timer.current);
            }
        };
    }, [dispatch, expiresAt]);

    return (
        <Routes>
            <Route path="/" element={ <PrivateRoute element = { <Dashboard /> } /> } />
            <Route path="/login" element={ <Login /> } />
            <Route path="/register" element={ <Register /> } />
        </Routes>
    );
}

export default App;
