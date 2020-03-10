import React, { useState, useEffect, useCallback } from 'react';
import MODAXIOS from '../config/modaxios';
import { useParams } from 'react-router-dom';
import { getAPIURL } from '../config/api';

import UserList from '../components/Users/UserList';

interface Like {
    id: string;
    username: string;
    numposts: number;
    avi: string;
    followers: number;
    following: number;
    joined: Date;
}

const Likes: React.FC = () => {
    const [likes, setLikes] = useState<Like[] | null>(null);
    const { humID } = useParams();

    const fetchLikes = useCallback(async (): Promise<any> => {
        const res = await MODAXIOS.get(getAPIURL() + `/api/likers/${humID}`);
        setLikes(res.data);
    }, [humID]);

    useEffect(() => {
        fetchLikes();
    }, [fetchLikes]);

    return (
        <div className="wrapper">
            <h1 style={{ textAlign: 'center' }}>likes</h1>
            <UserList users={likes!} />
        </div>
    );
};

export default Likes;
