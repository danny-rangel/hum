import React, { useState, useContext } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { AuthContext } from '../components/App';
import { StyledButton } from '../components/Styled/StyledButton';
import { StyledError, ErrorButton } from './Login';

export const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: center;
    width: 100%;
    justify-content: center;
`;

export const StyledForm = styled.form`
    background-color: white;
    width: 100%;
    height: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 350px;
    border-radius: 2px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px,
        rgba(0, 0, 0, 0.14) 0px 4px 5px 0px,
        rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
`;

export const StyledInput = styled.input`
    width: 80%;
    height: 40px;
    border-radius: 4px;
    border: none;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px,
        rgba(0, 0, 0, 0.14) 0px 4px 5px 0px,
        rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
    padding: 5px 10px;
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
            authContext.authDispatch({
                type: 'FETCH_ERROR',
                payload: 'Something went wrong. Try again!'
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
                        sign up
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
                        onClick={signUp}
                        padding="12px 50px"
                        fontSize="0.8em"
                        margin="20px 0"
                    >
                        sign up
                    </StyledButton>
                </StyledForm>
            </StyledDiv>
        </div>
    );
};

export default SignUp;
