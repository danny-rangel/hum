import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import UserList from '../components/Users/UserList';

const Followers = () => {
    const [followers, setFollowers] = useState(null);
    const { id } = useParams();

    const fetchFollowers = async () => {
        const res = await axios.get(`/api/followers/${id}`);
        setFollowers(res.data);
    };

    useEffect(() => {
        fetchFollowers();
    }, []);

    return <UserList users={followers} />;
};

export default Followers;
