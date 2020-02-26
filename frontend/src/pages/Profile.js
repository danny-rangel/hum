import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

import HumList from '../components/Hums/HumList';

const Profile = () => {
    const [hums, setHums] = useState(null);
    const [user, setUser] = useState(null);
    const { username } = useParams();

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`/api/user/${username}`);
            setUser(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchHums = async () => {
        try {
            const res = await axios.get(`/api/hums/${username}`);
            setHums(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const followUser = async () => {
        try {
            await axios.get(`/api/follow/${username}`);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchHums();
    }, []);

    return (
        <div>
            <div>
                {user ? (
                    <>
                        <img src={user.avi} alt="avi"></img>
                        <h1>{user.username}</h1>
                        <h4>hums:{user.numposts}</h4>
                        <Link to={`/followers/${user.id}`}>
                            followers:{user.followers}
                        </Link>
                        <Link to={`/following/${user.id}`}>
                            following:{user.following}
                        </Link>
                        <button onClick={followUser}>follow</button>
                    </>
                ) : null}
            </div>
            <HumList hums={hums} />
        </div>
    );
};

export default Profile;
