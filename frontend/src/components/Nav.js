import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from './App';

const Nav = () => {
    const authContext = useContext(AuthContext);

    const logout = async () => {
        try {
            const res = await axios.get('/api/logout');
            authContext.authDispatch({
                type: 'FETCH_SUCCESS',
                payload: res.data
            });
        } catch (err) {
            authContext.authDispatch({ type: 'FETCH_ERROR' });
        }
    };

    return (
        <div>
            <Link to="/">hum</Link>
            <span>
                {authContext.authState.auth
                    ? authContext.authState.auth.username
                    : null}
            </span>
            <span>
                {authContext.authState.auth ? (
                    <button onClick={logout}>Logout</button>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </span>
        </div>
    );
};

export default Nav;
