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

    return <UserList users={likes} />;
};

export default Likes;
