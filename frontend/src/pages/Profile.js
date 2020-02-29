import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { StyledButton } from '../components/Styled/StyledButton';
import { AuthContext } from '../components/App';

import HumList from '../components/Hums/HumList';

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    width: 100%;
`;

const StyledAVI = styled.img`
    width: 100px;
    border-radius: 50%;
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

    const fetchProfile = async source => {
        try {
            const res = await axios.get(`/api/user/${username}`, {
                cancelToken: source.token
            });
            setUser(res.data);
            setFollowersCount(res.data.followers);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchIsFollowing = async source => {
        try {
            const isFollowing = await axios.get(`/api/isfollowing/${user.id}`, {
                cancelToken: source.token
            });
            setIsFollowing(isFollowing.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchHums = async source => {
        try {
            const res = await axios.get(`/api/hums/${username}`, {
                cancelToken: source.token
            });
            setHums(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const followUser = async () => {
        try {
            setFollowersCount(followersCount + 1);
            const source = axios.CancelToken.source();
            setIsFollowing(true);
            await axios.get(`/api/follow/${username}`, {
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
            await axios.get(`/api/unfollow/${username}`, {
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
    }, [user]);

    useEffect(() => {
        const source = axios.CancelToken.source();
        fetchProfile(source);
        fetchHums(source);
        return () => {
            source.cancel();
        };
    }, [username]);

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
                                <Link to={`/edit/${authContext.auth.auth.id}`}>
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
                    <>
                        <HumList hums={hums} />
                    </>
                ) : (
                    <h4>nothing to see here...</h4>
                )}
            </StyledDiv>
        </div>
    );
};

export default Profile;
