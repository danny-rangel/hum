import React, { useState, useContext } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { AuthContext } from '../components/App';

const StyledForm = styled.form`
    background-color: white;
    width: 100%;
    height: 300px;
    display: grid;
    align-items: center;
    justify-content: center;
    max-width: 300px;
`;

const StyledInput = styled.input`
    width: 90%;
`;

const SignUp = () => {
    const authContext = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const signUp = async e => {
        e.preventDefault();
        authContext.auth.loading = true;
        try {
            const res = await axios.post('/api/signup', {
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
            <StyledForm method="post">
                <label>Username</label>
                <StyledInput
                    type="text"
                    name="username"
                    required
                    onChange={e => setUsername(e.target.value)}
                    value={username}
                ></StyledInput>
                <br />
                <label>Password</label>
                <StyledInput
                    type="password"
                    name="password"
                    required
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                ></StyledInput>
                <br />
                <button
                    type="submit"
                    value="submit"
                    disabled={authContext.auth.loading}
                    onClick={signUp}
                >
                    Sign Up
                </button>
            </StyledForm>
        </div>
    );
};

export default SignUp;
