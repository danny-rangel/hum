import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import MODAXIOS from '../config/modaxios';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { StyledButton } from '../components/Styled/StyledButton';
import { AuthContext } from '../components/App';
import Spinner from '../components/Styled/Spinner';
import { getAPIURL } from '../config/api';

import HumList from '../components/Hums/HumList';

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    width: 100%;
`;

export const StyledAVI = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #ffffff;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px,
        rgba(0, 0, 0, 0.14) 0px 4px 5px 0px,
        rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
`;

const Profile = () => {
    const authContext = useContext(AuthContext);
    const [hums, setHums] = useState(null);
    const [user, setUser] = useState(null);
    const [isFollowing, setIsFollowing] = useState(null);
    const [followersCount, setFollowersCount] = useState(null);
    const { username } = useParams();

    const fetchProfile = useCallback(
        async source => {
            try {
                const res = await MODAXIOS.get(
                    getAPIURL() + `/api/user/${username}`,
                    {
                        cancelToken: source.token
                    }
                );
                setUser(res.data);
                setFollowersCount(res.data.followers);
            } catch (err) {
                console.log(err);
            }
        },
        [username]
    );

    const fetchIsFollowing = useCallback(
        async source => {
            try {
                const isFollowing = await MODAXIOS.get(
                    getAPIURL() + `/api/isfollowing/${user.id}`,
                    {
                        cancelToken: source.token
                    }
                );
                setIsFollowing(isFollowing.data);
            } catch (err) {
                console.log(err);
            }
        },
        [user]
    );

    const fetchHums = useCallback(
        async source => {
            try {
                const res = await MODAXIOS.get(
                    getAPIURL() + `/api/hums/${username}`,
                    {
                        cancelToken: source.token
                    }
                );
                setHums(res.data);
            } catch (err) {
                console.log(err);
            }
        },
        [username]
    );

    const followUser = async () => {
        try {
            setFollowersCount(followersCount + 1);
            const source = axios.CancelToken.source();
            setIsFollowing(true);
            await MODAXIOS.get(getAPIURL() + `/api/follow/${username}`, {
                cancelToken: source.token
            });
            fetchIsFollowing(source);
            fetchProfile(source);
        } catch (err) {
            console.log(err);
        }
    };

    const unfollowUser = async () => {
        try {
            setFollowersCount(followersCount - 1);
            const source = axios.CancelToken.source();
            setIsFollowing(false);
            await MODAXIOS.get(getAPIURL() + `/api/unfollow/${username}`, {
                cancelToken: source.token
            });
            fetchIsFollowing(source);
            fetchProfile(source);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const source = axios.CancelToken.source();
        if (user) {
            fetchIsFollowing(source);
        }
        return () => {
            source.cancel();
        };
    }, [user, fetchIsFollowing]);

    useEffect(() => {
        const source = axios.CancelToken.source();
        fetchProfile(source);
        fetchHums(source);
        return () => {
            source.cancel();
        };
    }, [username, fetchProfile, fetchHums]);

    return (
        <div className="wrapper">
            <StyledDiv>
                {user ? (
                    <>
                        <StyledAVI src={user.avi} alt="avi"></StyledAVI>
                        <h1>{user.username}</h1>
                        <h2>{`hums: ${user.numposts}`}</h2>
                        <Link to={`/followers/${user.id}`}>
                            <h2>{`followers: ${followersCount}`}</h2>
                        </Link>
                        <Link to={`/following/${user.id}`}>
                            <h2>{`following: ${user.following}`}</h2>
                        </Link>
                        {authContext.auth.auth ? (
                            authContext.auth.auth.username !== username ? (
                                isFollowing ? (
                                    <StyledButton
                                        padding="12px 40px"
                                        fontSize="1em"
                                        margin="20px"
                                        onClick={unfollowUser}
                                    >
                                        unfollow
                                    </StyledButton>
                                ) : (
                                    <StyledButton
                                        padding="12px 40px"
                                        fontSize="1em"
                                        margin="20px"
                                        onClick={followUser}
                                    >
                                        follow
                                    </StyledButton>
                                )
                            ) : (
                                <Link
                                    to={`/edit/${authContext.auth.auth.username}`}
                                >
                                    <StyledButton
                                        padding="12px 40px"
                                        fontSize="1em"
                                        margin="20px"
                                    >
                                        edit
                                    </StyledButton>
                                </Link>
                            )
                        ) : null}
                    </>
                ) : null}
                {hums ? (
                    hums.length === 0 ? (
                        <h4>nothing to see here...</h4>
                    ) : (
                        <>
                            <HumList hums={hums} fetchHums={fetchHums} />
                        </>
                    )
                ) : (
                    <Spinner />
                )}
            </StyledDiv>
        </div>
    );
};

export default Profile;
