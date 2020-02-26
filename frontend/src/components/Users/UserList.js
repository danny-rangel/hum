import React from 'react';
import UserItem from './UserItem';

const UserList = ({ users }) => {
    const renderUsers = () => {
        return users.map(user => {
            return <UserItem key={user.id} user={user} />;
        });
    };

    return <>{users ? renderUsers() : null}</>;
};

export default UserList;
