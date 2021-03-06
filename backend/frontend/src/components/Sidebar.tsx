import React, { useContext } from 'react';
import styled from 'styled-components';
import MODAXIOS from '../config/modaxios';
import { getAPIURL } from '../config/api';

import { Link } from 'react-router-dom';
import { ErrorButton } from './Styled/StyledError';
import { AuthContext } from './App';
import { RedirectContext } from './App';
import { ReactComponent as CloseIcon } from '../icons/close.svg';

interface StyledSidebarProps {
    show?: boolean;
}

const StyledSidebar = styled.div<StyledSidebarProps>`
    position: absolute;
    width: 200px;
    left: ${props => (props.show ? 0 : '-200px')};
    height: 100%;
    background: #ffffff;
    transition: 0.4s;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px,
        rgba(0, 0, 0, 0.14) 0px 4px 5px 0px,
        rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
`;

const SidebarUL = styled.ul`
    margin: 40px 0 0;
    padding: 0;
`;

const SidebarLI = styled.li`
    color: #2f2f2f;
    font-size: 1.2rem;
    padding: 10px;

    :hover {
        background-color: #f1eeee;
    }
`;

interface SidebarProps {
    show?: boolean;
    setShowSidebar: Function;
}

const Sidebar: React.FC<SidebarProps> = ({ show, setShowSidebar }) => {
    const authContext = useContext(AuthContext);
    const redirectContext = useContext(RedirectContext);

    const logout = async (): Promise<any> => {
        try {
            const res = await MODAXIOS.get(getAPIURL() + '/api/logout');
            authContext.authDispatch({
                type: 'FETCH_SUCCESS',
                payload: res.data
            });
            redirectContext.redirectDispatch({
                type: 'AUTH_FALSE'
            });
            setShowSidebar(false);
        } catch (err) {
            authContext.authDispatch({ type: 'FETCH_ERROR' });
        }
    };

    return (
        <StyledSidebar show={show}>
            <ErrorButton
                onClick={() => setShowSidebar(false)}
                style={{
                    position: 'absolute',
                    right: 0,
                    margin: '10px',
                    width: '20px',
                    height: '20px',
                    padding: 0
                }}
            >
                <CloseIcon style={{ width: '20px', height: '20px' }} />
            </ErrorButton>
            <SidebarUL>
                <SidebarLI>
                    <Link
                        style={{ marginLeft: '20px' }}
                        to={`/${
                            authContext.auth.auth
                                ? authContext.auth.auth.username
                                : null
                        }`}
                        onClick={() => setShowSidebar(false)}
                    >
                        {authContext.auth.auth
                            ? authContext.auth.auth.username
                            : null}
                    </Link>
                </SidebarLI>
                <SidebarLI>
                    <button
                        style={{
                            border: 'none',
                            backgroundColor: 'transparent',
                            fontSize: '1.2rem',
                            padding: 0,
                            color: '#2f2f2f',
                            cursor: 'pointer',
                            marginLeft: '20px'
                        }}
                        onClick={logout}
                    >
                        log out
                    </button>
                </SidebarLI>
            </SidebarUL>
        </StyledSidebar>
    );
};

export default Sidebar;
