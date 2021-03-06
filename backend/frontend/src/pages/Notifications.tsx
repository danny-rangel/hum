import React, { useState, useEffect, useContext } from 'react';
import MODAXIOS from '../config/modaxios';
import { Redirect } from 'react-router-dom';
import { RedirectContext } from '../components/App';
import styled from 'styled-components';
import { getAPIURL } from '../config/api';

import Spinner from '../components/Styled/Spinner';
import NotificationList from '../components/Notifications/NotificationList';
import { Notification } from '../components/Notifications/NotificationList';

const StyledDiv = styled.div`
    display: flex;
    margin: 30px auto;
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

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[] | null>(
        null
    );
    const redirectContext = useContext(RedirectContext);

    const fetchNotifications = async (): Promise<any> => {
        try {
            const res = await MODAXIOS.get(getAPIURL() + '/api/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="wrapper">
            <h1 style={{ textAlign: 'center' }}>notifications</h1>
            <StyledDiv>
                {redirectContext.redirect.toLanding ? (
                    <Redirect to="/" />
                ) : null}

                {notifications ? (
                    notifications.length === 0 ? (
                        <p>No notifications</p>
                    ) : (
                        <NotificationList notifications={notifications} />
                    )
                ) : (
                    <Spinner />
                )}
            </StyledDiv>
        </div>
    );
};

export default Notifications;
