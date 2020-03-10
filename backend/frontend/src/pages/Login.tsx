import React, { useState, useContext } from 'react';
import MODAXIOS from '../config/modaxios';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { getAPIURL } from '../config/api';

import { AuthContext } from '../components/App';
import { RedirectContext } from '../components/App';
import { StyledDiv, StyledForm, StyledInput } from './SignUp';
import { StyledButton } from '../components/Styled/StyledButton';
import StyledError from '../components/Styled/StyledError';

const StyledH2 = styled.h2`
    color: rgb(134, 134, 134);
    font-family: Khula;
    letter-spacing: -2px;
    font-weight: 100;
    font-size: 2em;
    margin: 10px 0 0;
`;

const Login: React.FC = () => {
    const authContext = useContext(AuthContext);
    const redirectContext = useContext(RedirectContext);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showError, setShowError] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    let history = useHistory();

    const fetchUser = async (e): Promise<any> => {
        e.preventDefault();
        authContext.auth.loading = true;
        try {
            setIsFetching(true);
            const res = await MODAXIOS.post(getAPIURL() + '/api/login', {
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
                    <StyledH2>log in</StyledH2>
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
