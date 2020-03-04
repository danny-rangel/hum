import React, { useState, useEffect, useCallback } from 'react';
import MODAXIOS from '../config/modaxios';
import { useParams } from 'react-router-dom';
import { getAPIURL } from '../config/api';

import UserList from '../components/Users/UserList';

const Followers = () => {
    const [followers, setFollowers] = useState(null);
    const { id } = useParams();

    const fetchFollowers = useCallback(async () => {
        const res = await MODAXIOS.get(getAPIURL() + `/api/followers/${id}`);
        setFollowers(res.data);
    }, [id]);

    useEffect(() => {
        fetchFollowers();
    }, [fetchFollowers]);

    return (
        <div className="wrapper">
            <h1 style={{ textAlign: 'center' }}>followers</h1>
            <UserList users={followers} />
        </div>
    );
};

export default Followers;
