import React, { useState, useContext } from 'react';
import axios from 'axios';

import { AuthContext } from '../components/App';

const Login = () => {
    const authContext = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const fetchUser = async e => {
        e.preventDefault();
        authContext.authState.loading = true;
        try {
            const res = await axios.post('/api/login', {
                username: username,
                password: password
            });
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
            <form method="post">
                <label></label>
                Username
                <input
                    type="text"
                    name="username"
                    required
                    onChange={e => setUsername(e.target.value)}
                    value={username}
                ></input>
                <br />
                <label></label>
                Password
                <input
                    type="password"
                    name="password"
                    required
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                ></input>
                <br />
                <button
                    type="submit"
                    value="submit"
                    disabled={authContext.authState.loading}
                    onClick={fetchUser}
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;