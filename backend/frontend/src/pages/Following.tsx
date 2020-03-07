import React, { useState, useEffect, useCallback } from 'react';
import MODAXIOS from '../config/modaxios';
import { useParams } from 'react-router-dom';
import { getAPIURL } from '../config/api';

import UserList from '../components/Users/UserList';

const Following = () => {
    const [following, setFollowing] = useState(null);
    const { id } = useParams();

    const fetchFollowing = useCallback(async () => {
        const res = await MODAXIOS.get(getAPIURL() + `/api/following/${id}`);
        setFollowing(res.data);
    }, [id]);

    useEffect(() => {
        fetchFollowing();
    }, [fetchFollowing]);

    return (
        <div className="wrapper">
            <h1 style={{ textAlign: 'center' }}>following</h1>
            <UserList users={following} />
        </div>
    );
};

export default Following;
