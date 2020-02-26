import React, { useState, useEffect } from 'react';
import axios from 'axios';

import NotificationList from '../components/Notifications/NotificationList';

const Notifications = () => {
    const [notifications, setNotifications] = useState(null);

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
        <div>
            <NotificationList notifications={notifications} />
        </div>
    );
};

export default Notifications;
