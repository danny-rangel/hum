import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import UserList from '../components/Users/UserList';

const Likes = () => {
    const [likes, setLikes] = useState(null);
    const { humID } = useParams();

    const fetchLikes = async () => {
        const res = await axios.get(`/api/likers/${humID}`);
        setLikes(res.data);
    };

    useEffect(() => {
        fetchLikes();
    }, []);

    return (
        <div className="wrapper">
            <h1 style={{ textAlign: 'center' }}>likes</h1>
            <UserList users={likes} />
        </div>
    );
};

export default Likes;
