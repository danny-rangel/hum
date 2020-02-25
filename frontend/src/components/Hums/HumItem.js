import React from 'react';

const HumItem = ({ hum }) => {
    return (
        <div>
            <h1>{hum.content}</h1>
            <h4>{hum.username}</h4>
            <h4>{`${hum.likes} likes`}</h4>
        </div>
    );
};

export default HumItem;
