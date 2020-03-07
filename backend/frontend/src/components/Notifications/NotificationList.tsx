import React from 'react';
import NotificationItem from './NotificationItem';

const NotificationList = ({ notifications }) => {
    const renderNotifications = () => {
        return notifications.map(notification => {
            return (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                />
            );
        });
    };

    return <>{notifications ? renderNotifications() : null}</>;
};

export default NotificationList;
