import React from 'react';
import styled from 'styled-components';

const NotiItem = styled.div`
    padding: 10px 0;

    :not(:last-child) {
        border-bottom: 1px solid #dfdddd;
    }
`;

const NotificationItem = ({ notification }) => {
    const renderText = () => {
        if (notification.kind === 'like') {
            return <h2>{`Your post was liked by ${notification.from_id}`}</h2>;
        } else if (notification.kind === 'follow') {
            return <h2>{`You were followed by ${notification.link}`}</h2>;
        }
    };

    return <NotiItem>{renderText()}</NotiItem>;
};

export default NotificationItem;
