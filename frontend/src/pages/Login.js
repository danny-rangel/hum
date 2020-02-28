import React, { useState, useContext } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { AuthContext } from '../components/App';
import { RedirectContext } from '../components/App';
import { StyledDiv, StyledForm, StyledInput } from './SignUp';
import { StyledButton } from '../components/Styled/StyledButton';

export const StyledError = styled.span`
    font-size: 0.8em;
    color: white;
    font-weight: 100;
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 300px;
    height: 70px;
    background-color: #ff2b2b;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 2px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px,
        rgba(0, 0, 0, 0.14) 0px 4px 5px 0px,
        rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;

    animation: slideDown 1s;

    @keyframes slideDown {
        from {
            right: 1000px;
        }
        to {
            right: 20px;
        }
    }
`;

export const ErrorButton = styled.button`
    cursor: pointer;
    border: none;
    margin: 0px 12px 30px 0px;
    background: transparent;
    font-weight: 900;
    font-size: 1.2em;
    font-family: Khula;
`;

const Login = () => {
    const authContext = useContext(AuthContext);
    const redirectContext = useContext(RedirectContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const fetchUser = async e => {
        e.preventDefault();
        authContext.auth.loading = true;
        try {
            const res = await axios.post('/api/login', {
                username: username,
                password: password
            });
            authContext.authDispatch({
                type: 'FETCH_SUCCESS',
                payload: res.data
            });
            redirectContext.redirectDispatch({
                type: 'AUTH_TRUE'
            });
        } catch (err) {
            authContext.authDispatch({
                type: 'FETCH_ERROR',
                payload: 'Invalid username or password'
            });
        }
    };

    return (
        <div className="wrapper">
            <StyledDiv>
                <StyledForm method="post">
                    <h2
                        style={{
                            color: 'rgb(134, 134, 134)',
                            fontFamily: 'Khula',
                            letterSpacing: '-2px',
                            fontWeight: '100',
                            fontSize: '2em',
                            margin: '10px 0 0'
                        }}
                    >
                        log in
                    </h2>
                    <div
                        style={{
                            width: '100%',
                            height: '2px',
                            backgroundColor: 'rgb(242, 242, 242)',
                            margin: '10px 0 20px'
                        }}
                    ></div>
                    <StyledInput
                        type="text"
                        name="username"
                        required
                        onChange={e => setUsername(e.target.value)}
                        value={username}
                        placeholder="username"
                    ></StyledInput>
                    <br />
                    <StyledInput
                        type="password"
                        name="password"
                        required
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        placeholder="password"
                    ></StyledInput>
                    <br />
                    {authContext.auth.error === '' ? null : (
                        <StyledError>
                            <h4 style={{ marginLeft: '60px' }}>
                                {authContext.auth.error}
                            </h4>
                            <ErrorButton
                                onClick={() =>
                                    authContext.authDispatch({
                                        type: 'FETCH_ERROR',
                                        payload: ''
                                    })
                                }
                            >
                                X
                            </ErrorButton>
                        </StyledError>
                    )}
                    <StyledButton
                        type="submit"
                        value="submit"
                        disabled={authContext.auth.loading}
                        onClick={fetchUser}
                        padding="12px 50px"
                        fontSize="0.8em"
                        margin="20px 0"
                    >
                        log in
                    </StyledButton>
                </StyledForm>
            </StyledDiv>
        </div>
    );
};

export default Login;
