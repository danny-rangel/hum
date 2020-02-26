import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { RedirectContext } from '../components/App';

import NotificationList from '../components/Notifications/NotificationList';

const Notifications = () => {
    const [notifications, setNotifications] = useState(null);
    const redirectContext = useContext(RedirectContext);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('/api/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <>
            {redirectContext.redirect.toLanding ? <Redirect to="/" /> : null}
            <NotificationList notifications={notifications} />
        </>
    );
};

export default Notifications;
