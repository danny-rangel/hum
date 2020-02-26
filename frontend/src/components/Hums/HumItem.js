import React from 'react';
import axios from 'axios';

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
            <h4>{hum.username}</h4>
            <h4>{`${hum.likes} likes`}</h4>
            <button onClick={likeHum}>Like</button>
        </div>
    );
};

export default HumItem;
