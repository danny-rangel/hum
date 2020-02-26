import React from 'react';

const NotificationItem = ({ notification }) => {
    return (
        <div>
            <h1>{notification.kind}</h1>
            <h4>{notification.link}</h4>
        </div>
    );
};

export default NotificationItem;
