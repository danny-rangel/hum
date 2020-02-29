import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { ReactComponent as UnlikedIcon } from '../../icons/heart.svg';
import { ReactComponent as LikedIcon } from '../../icons/filledheart.svg';

const StyledDiv = styled.div`
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: space-around;
    background-color: #ffffff;
    border: none;
    border-radius: 2px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px,
        rgba(0, 0, 0, 0.14) 0px 4px 5px 0px,
        rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
    padding: 20px;
    margin: 10px 0;
    width: 100%;
    max-width: 400px;
    min-height: 120px;
    overflow-wrap: break-word;
    word-wrap: break-word;
`;

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
        <StyledDiv>
            <p style={{ fontWeight: 'bold' }}>{hum.content}</p>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Link to={`/${hum.username}`}>{hum.username}</Link>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <button
                        style={{ border: 'none', background: 'transparent' }}
                        onClick={likeHum}
                    >
                        <UnlikedIcon
                            style={{
                                width: '20px',
                                height: '20px',
                                cursor: 'pointer'
                            }}
                        />
                    </button>
                    <Link to={`/likes/${hum.id}`}>{`${hum.likes} likes`}</Link>
                </div>
            </div>
        </StyledDiv>
    );
};

export default HumItem;
