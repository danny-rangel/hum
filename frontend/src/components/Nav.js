import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

import { AuthContext } from './App';
import { RedirectContext } from './App';
import { StyledButton } from './Styled/StyledButton';

const StyledHeader = styled.header`
    width: 100%;
    height: 50px;
    border-bottom: 1px solid rgb(200, 200, 200);
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const StyledLinks = styled.li`
    transition: all 0.3s ease 0s;
    display: inline-block;
    margin-right: 40px;

    :hover {
        color: mediumslateblue;
    }
`;

const Nav = () => {
    const authContext = useContext(AuthContext);
    const redirectContext = useContext(RedirectContext);

    const logout = async () => {
        try {
            const res = await axios.get('/api/logout');
            authContext.authDispatch({
                type: 'FETCH_SUCCESS',
                payload: res.data
            });
            redirectContext.redirectDispatch({
                type: 'AUTH_FALSE'
            });
        } catch (err) {
            authContext.authDispatch({ type: 'FETCH_ERROR' });
        }
    };

    return (
        <StyledHeader>
            <Link
                to="/home"
                style={{ marginRight: 'auto', marginLeft: '40px' }}
            >
                hum
            </Link>
            <nav>
                <ul>
                    <StyledLinks>
                        {authContext.auth.auth ? (
                            <Link to="/notifications">notifications</Link>
                        ) : null}
                    </StyledLinks>
                    <StyledLinks>
                        {authContext.auth.auth ? (
                            <Link to={authContext.auth.auth.username}>
                                {authContext.auth.auth.username}
                            </Link>
                        ) : null}
                    </StyledLinks>
                </ul>
            </nav>
            {authContext.auth.auth ? (
                <StyledButton onClick={logout} style={{ marginRight: '40px' }}>
                    Logout
                </StyledButton>
            ) : (
                <Link to="/login" style={{ marginRight: '40px' }}>
                    Login
                </Link>
            )}
        </StyledHeader>
    );
};

export default Nav;
