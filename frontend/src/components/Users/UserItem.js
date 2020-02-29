import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledUserItem = styled.div`
    padding: 10px 0;
    display: flex;
    align-items: center;

    :not(:last-child) {
        border-bottom: 1px solid #dfdddd;
    }
`;

const StyledAVI = styled.img`
    width: 30px;
    border-radius: 50%;
    background-color: #ffffff;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px,
        rgba(0, 0, 0, 0.14) 0px 4px 5px 0px,
        rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
`;

const UserItem = ({ user }) => {
    return (
        <StyledUserItem>
            <StyledAVI src={user.avi}></StyledAVI>
            <Link
                to={`/${user.username}`}
                style={{ marginLeft: '10px', fontWeight: 'bold' }}
            >
                {user.username}
            </Link>
        </StyledUserItem>
    );
};

export default UserItem;
