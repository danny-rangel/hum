import React from 'react';
import { Link } from 'react-router-dom';

const UserItem = ({ user }) => {
    return (
        <div>
            <Link to={`/${user.username}`}>{user.username}</Link>
        </div>
    );
};

export default UserItem;
