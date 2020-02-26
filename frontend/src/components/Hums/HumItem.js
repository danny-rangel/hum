import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HumItem = ({ hum }) => {
    const likeHum = async () => {
        try {
            await axios.post('/api/like', {
                id: hum.id
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <h1>{hum.content}</h1>
            <Link to={`/${hum.username}`}>{hum.username}</Link>
            <Link to={`/likes/${hum.id}`}>{`${hum.likes} likes`}</Link>
            <button onClick={likeHum}>Like</button>
        </div>
    );
};

export default HumItem;
