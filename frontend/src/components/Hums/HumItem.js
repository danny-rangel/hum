import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';

import { AuthContext } from '../App';
import { ReactComponent as UnlikedIcon } from '../../icons/heart.svg';
import { ReactComponent as LikedIcon } from '../../icons/filledheart.svg';
import { ReactComponent as TrashIcon } from '../../icons/garbage.svg';

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

const HumItem = ({ hum, fetchHums }) => {
    const [isLiked, setIsLiked] = useState(null);
    const [likes, setLikes] = useState(null);
    const authContext = useContext(AuthContext);

    const fetchIsLiked = useCallback(
        async source => {
            const isLiked = await axios.get(`/api/isliked/${hum.id}`, {
                cancelToken: source.token
            });
            setIsLiked(isLiked.data);
        },
        [hum]
    );

    const fetchLikeCount = useCallback(
        async source => {
            const res = await axios.get(`/api/likes/${hum.id}`, {
                cancelToken: source.token
            });
            setLikes(res.data);
        },
        [hum]
    );

    useEffect(() => {
        const source = axios.CancelToken.source();
        fetchIsLiked(source);
        fetchLikeCount(source);
        return () => {
            source.cancel();
        };
    }, [fetchIsLiked, fetchLikeCount]);

    const likeHum = async () => {
        try {
            const source = axios.CancelToken.source();
            setIsLiked(true);
            setLikes(likes + 1);
            await axios.post('/api/like', {
                id: hum.id
            });
            fetchIsLiked(source);
            fetchLikeCount(source);
        } catch (err) {
            console.log(err);
        }
    };

    const unlikeHum = async () => {
        try {
            const source = axios.CancelToken.source();
            setIsLiked(false);
            setLikes(likes - 1);
            await axios.post('/api/unlike', {
                id: hum.id
            });
            fetchIsLiked(source);
            fetchLikeCount(source);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteHum = async () => {
        try {
            const source = axios.CancelToken.source();
            await axios.delete(`/api/delete/hums/${hum.id}`, {
                cancelToken: source.token
            });
            fetchHums(source);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <StyledDiv>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h5 style={{ letterSpacing: '0px' }}>
                    {moment(hum.posted, moment.ISO_8601).fromNow()}
                </h5>
                {authContext.auth.auth ? (
                    authContext.auth.auth.id === hum.user_id ? (
                        <button
                            style={{
                                border: 'none',
                                background: 'transparent',
                                padding: 0
                            }}
                            onClick={deleteHum}
                        >
                            <TrashIcon
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer'
                                }}
                            />
                        </button>
                    ) : null
                ) : null}
            </div>
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
                        onClick={isLiked ? unlikeHum : likeHum}
                    >
                        {isLiked ? (
                            <LikedIcon
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer'
                                }}
                            />
                        ) : (
                            <UnlikedIcon
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer'
                                }}
                            />
                        )}
                    </button>
                    <Link to={`/likes/${hum.id}`}>{`${likes} likes`}</Link>
                </div>
            </div>
        </StyledDiv>
    );
};

export default HumItem;
