import React from 'react';
import UserItem from './UserItem';
import styled from 'styled-components';

const StyledDiv = styled.div`
    display: flex;
    margin: 50px auto;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    max-width: 400px;
    background-color: #ffffff;
    border: none;
    border-radius: 2px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px,
        rgba(0, 0, 0, 0.14) 0px 4px 5px 0px,
        rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
    padding: 20px;
`;

const UserList = ({ users }) => {
    const renderUsers = () => {
        return users.map(user => {
            return <UserItem key={user.id} user={user} />;
        });
    };

    return <StyledDiv>{users ? renderUsers() : null}</StyledDiv>;
};

export default UserList;
