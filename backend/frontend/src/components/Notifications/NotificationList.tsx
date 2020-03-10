import React from 'react';
import NotificationItem from './NotificationItem';

export interface Notification {
    id: string;
    kind: string;
    from_id: number;
    to_id: number;
    from_username: string;
    link: string;
    created: Date;
}

interface NotificationListProps {
    notifications: Notification[];
}

const NotificationList: React.FC<NotificationListProps> = ({
    notifications
}) => {
    const renderNotifications = (): JSX.Element[] => {
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
