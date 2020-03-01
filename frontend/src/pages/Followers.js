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

    return (
        <div className="wrapper">
            <h1 style={{ textAlign: 'center' }}>followers</h1>
            <UserList users={followers} />
        </div>
    );
};

export default Followers;
