import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Redirect, useParams, useHistory } from 'react-router-dom';
import { getAPIURL } from '../config/api';

import { RedirectContext } from '../components/App';
import { AuthContext } from '../components/App';
import { StyledButton } from '../components/Styled/StyledButton';
import { StyledInput } from './SignUp';
import { StyledAVI } from './Profile';

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0px;
    width: 100%;
`;

const Edit = () => {
    const redirectContext = useContext(RedirectContext);
    const authContext = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [newUsername, setNewUsername] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const { username } = useParams();
    let history = useHistory();

    const fetchProfile = useCallback(async () => {
        const res = await axios.get(getAPIURL() + `/api/user/${username}`);
        setUser(res.data);
        setNewUsername(res.data.username);
    }, [username]);

    const fileHandler = e => {
        setNewImage(e.target.files[0]);
    };

    const saveUser = async () => {
        const formData = new FormData();
        if (newImage) {
            formData.append('avi', newImage, newImage.name);
        }

        formData.append('username', JSON.stringify(newUsername));
        const updateRes = await axios.post(
            getAPIURL() + '/api/update',
            formData
        );
        const res = await axios.get(
            getAPIURL() + `/api/user/${updateRes.data.username}`
        );
        authContext.authDispatch({
            type: 'FETCH_SUCCESS',
            payload: res.data
        });
        history.push(`/${res.data.username}`);
    };

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return (
        <>
            {redirectContext.redirect.toLanding ? <Redirect to="/" /> : null}
            <div className="wrapper">
                <StyledDiv>
                    <h1>edit profile</h1>
                    <h2>username</h2>
                    <StyledInput
                        onChange={e => setNewUsername(e.target.value)}
                        value={newUsername || ''}
                    ></StyledInput>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '30px'
                        }}
                    >
                        <StyledAVI src={user ? user.avi : null}></StyledAVI>
                        <input
                            type="file"
                            name="avi"
                            id="file"
                            onChange={e => fileHandler(e)}
                        ></input>
                        <label htmlFor="file">Upload</label>
                    </div>
                    {newImage ? <p>{newImage.name}</p> : null}
                    <StyledButton
                        padding="12px 40px"
                        fontSize="1em"
                        margin="40px 20px"
                        onClick={saveUser}
                    >
                        save
                    </StyledButton>
                </StyledDiv>
            </div>
        </>
    );
};

export default Edit;
