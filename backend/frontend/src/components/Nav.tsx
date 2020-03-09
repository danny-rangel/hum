import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ReactComponent as NotiIcon } from '../icons/bell.svg';
import { ReactComponent as SearchIcon } from '../icons/search.svg';
import { ReactComponent as HumIcon } from '../icons/hum.svg';
import { AuthContext } from './App';
import { StyledButton } from './Styled/StyledButton';

const StyledHeader = styled.header`
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    @media (max-width: 600px) {
        justify-content: space-evenly;
    }
`;

const HumLink = styled(Link)`
    margin-right: auto;
    margin-left: 40px;
    border-radius: 50%;

    @media (max-width: 600px) {
        margin-left: 20px;
    }
`;

const StyledUL = styled.ul`
    display: flex;
    align-items: center;
    @media (max-width: 600px) {
        justify-content: space-around;
    }
`;

const StyledLi = styled.li`
    display: inline-block;
    margin-right: 40px;

    @media (max-width: 600px) {
        margin-right: 25px;
    }
`;

const StyledLink = styled(Link)`
    margin: 0;
    height: 100%;
`;

const StyledAVI = styled.img`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #ffffff;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px,
        rgba(0, 0, 0, 0.14) 0px 4px 5px 0px,
        rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
`;

interface Props {
    setShowSidebar: Function;
}

const Nav: React.FC<Props> = ({ setShowSidebar }) => {
    const authContext = useContext(AuthContext);

    return (
        <StyledHeader>
            <HumLink to="/home" className="line-under">
                <HumIcon style={{ width: '40px', height: '40px' }} />
            </HumLink>
            <nav>
                <StyledUL>
                    <StyledLi className="line-under">
                        {authContext.auth.auth ? (
                            <StyledLink to="/search">
                                <SearchIcon
                                    style={{ width: '30px', height: '30px' }}
                                />
                            </StyledLink>
                        ) : null}
                    </StyledLi>
                    <StyledLi className="line-under">
                        {authContext.auth.auth ? (
                            <StyledLink to="/notifications">
                                <NotiIcon
                                    style={{ width: '30px', height: '30px' }}
                                />
                            </StyledLink>
                        ) : null}
                    </StyledLi>
                    <StyledLi>
                        {authContext.auth.auth ? (
                            <button
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    borderRadius: '50%',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setShowSidebar(true)}
                            >
                                <StyledAVI
                                    src={authContext.auth.auth.avi}
                                ></StyledAVI>
                            </button>
                        ) : null}
                    </StyledLi>
                </StyledUL>
            </nav>
            {authContext.auth.auth ? null : (
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
