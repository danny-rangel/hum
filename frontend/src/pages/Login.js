import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import { AuthContext } from '../components/App';
import { RedirectContext } from '../components/App';
import { StyledDiv, StyledForm, StyledInput } from './SignUp';
import { StyledButton } from '../components/Styled/StyledButton';
import StyledError from '../components/Styled/StyledError';

const Login = () => {
    const authContext = useContext(AuthContext);
    const redirectContext = useContext(RedirectContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    let history = useHistory();

    const fetchUser = async e => {
        e.preventDefault();
        authContext.auth.loading = true;
        try {
            setIsFetching(true);
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
            setIsFetching(false);
            history.push('/home');
        } catch (err) {
            authContext.authDispatch({
                type: 'FETCH_ERROR',
                payload: 'Invalid username or password'
            });
            setShowError(true);
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
                    {showError ? (
                        <StyledError
                            message={authContext.auth.error}
                            setShowError={setShowError}
                        />
                    ) : null}
                    <StyledButton
                        type="submit"
                        value="submit"
                        disabled={isFetching}
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
