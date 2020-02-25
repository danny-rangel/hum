import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import HumList from '../components/Hums/HumList';

const Profile = () => {
    const [hums, setHums] = useState(null);
    const { username } = useParams();

    const fetchHums = async () => {
        try {
            const res = await axios.get(`/api/hums/${username}`);
            setHums(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchHums();
    }, []);

    return (
        <div>
            <div>
                <h1>{username}</h1>
            </div>
            <HumList hums={hums} />
        </div>
    );
};

export default Profile;
