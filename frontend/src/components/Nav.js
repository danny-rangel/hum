import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { ReactComponent as NotiIcon } from '../icons/bell.svg';
import { ReactComponent as SearchIcon } from '../icons/search.svg';
import { AuthContext } from './App';
import { RedirectContext } from './App';
import { StyledButton } from './Styled/StyledButton';

const StyledHeader = styled.header`
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const StyledLi = styled.li`
    display: inline-block;
    margin-right: 40px;
`;

const StyledLink = styled(Link)`
    margin: 0;
    height: 100%;
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
            {authContext.auth.auth ? (
                <Link
                    to="/home"
                    className="line-under-dark"
                    style={{ marginRight: 'auto', marginLeft: '40px' }}
                >
                    <h4>hum</h4>
                </Link>
            ) : null}
            <nav>
                <ul style={{ display: 'flex', alignItems: 'center' }}>
                    <StyledLi className="line-under-dark">
                        {authContext.auth.auth ? (
                            <StyledLink to="/notifications">
                                <SearchIcon
                                    style={{ width: '30px', height: '30px' }}
                                />
                            </StyledLink>
                        ) : null}
                    </StyledLi>
                    <StyledLi className="line-under-dark">
                        {authContext.auth.auth ? (
                            <StyledLink to="/notifications">
                                <NotiIcon
                                    style={{ width: '30px', height: '30px' }}
                                />
                            </StyledLink>
                        ) : null}
                    </StyledLi>
                    <StyledLi className="line-under-dark">
                        {authContext.auth.auth ? (
                            <StyledLink to={authContext.auth.auth.username}>
                                <h4>{authContext.auth.auth.username}</h4>
                            </StyledLink>
                        ) : null}
                    </StyledLi>
                </ul>
            </nav>
            {authContext.auth.auth ? (
                <StyledButton
                    onClick={logout}
                    padding="8px 30px"
                    fontSize="1em"
                    className="login-button"
                >
                    Logout
                </StyledButton>
            ) : (
                <Link to="/login" className="login-button">
                    <StyledButton padding="8px 30px" fontSize="1em">
                        log in
                    </StyledButton>
                </Link>
            )}
        </StyledHeader>
    );
};

export default Nav;
