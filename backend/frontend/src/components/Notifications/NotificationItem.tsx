import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Notification } from './NotificationList';

const NotiItem = styled.div`
    padding: 10px 0;

    :not(:last-child) {
        border-bottom: 1px solid #dfdddd;
    }
`;

interface NotificationItemProps {
    notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    notification
}) => {
    const renderText = () => {
        if (notification.kind === 'like') {
            return (
                <div>
                    <h2>
                        Your{' '}
                        <Link
                            to={`/hum/${notification.link}`}
                            style={{ fontWeight: 'bold' }}
                        >{` post `}</Link>{' '}
                        was liked by
                        <Link
                            to={`/${notification.from_username}`}
                            style={{ fontWeight: 'bold' }}
                        >
                            {` ` + notification.from_username}
                        </Link>
                        .
                    </h2>
                    <h5 style={{ letterSpacing: '0px' }}>
                        {moment(
                            notification.created,
                            moment.ISO_8601
                        ).fromNow()}
                    </h5>
                </div>
            );
        } else if (notification.kind === 'follow') {
            return (
                <div>
                    <h2>
                        <Link
                            to={`/${notification.from_username}`}
                            style={{ fontWeight: 'bold' }}
                        >
                            {notification.from_username}
                        </Link>
                        {` followed you.`}
                    </h2>
                    <h5 style={{ letterSpacing: '0px' }}>
                        {moment(
                            notification.created,
                            moment.ISO_8601
                        ).fromNow()}
                    </h5>
                </div>
            );
        }
    };

    return <NotiItem>{renderText()}</NotiItem>;
};

export default NotificationItem;
