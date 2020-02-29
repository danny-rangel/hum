import React from 'react';

const NotificationItem = ({ notification }) => {
    const renderText = () => {
        if (notification.kind === 'like') {
            return <h2>{`Your post was liked by ${notification.from_id}`}</h2>;
        } else if (notification.kind === 'follow') {
            return <h2>{`You were followed by ${notification.link}`}</h2>;
        }
    };

    return <div>{renderText()}</div>;
};

export default NotificationItem;
