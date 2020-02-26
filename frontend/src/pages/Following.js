import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import UserList from '../components/Users/UserList';

const Following = () => {
    const [following, setFollowing] = useState(null);
    const { id } = useParams();

    const fetchFollowing = async () => {
        const res = await axios.get(`/api/following/${id}`);
        setFollowing(res.data);
        console.log(res.data);
    };

    useEffect(() => {
        fetchFollowing();
    }, []);

    return <UserList users={following} />;
};

export default Following;
