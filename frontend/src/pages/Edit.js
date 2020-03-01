import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Redirect, useParams, useHistory } from 'react-router-dom';

import { RedirectContext } from '../components/App';
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

const StyledAVIInput = styled.input`
    background: transparent;
    border-radius: 0px;
    /* border: 1px solid palevioletred; */
    color: palevioletred;
    cursor: pointer;
    transition: all 0.3s ease 0s;
    padding: 12px 40px;
    font-size: 1em;
    margin: 20px;
    width: 50px;
    height: 50px;

    :hover {
        background-color: palevioletred;
        color: white;
    }
`;

const Edit = () => {
    const redirectContext = useContext(RedirectContext);
    const [user, setUser] = useState(null);
    const [newUsername, setNewUsername] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const { username } = useParams();
    let history = useHistory();

    const fetchProfile = async () => {
        const res = await axios.get(`/api/user/${username}`);
        setUser(res.data);
        setNewUsername(res.data.username);
    };

    const fileHandler = e => {
        setNewImage(e.target.files[0]);
    };

    const saveUser = async () => {
        const formData = new FormData();
        if (newImage) {
            formData.append('avi', newImage, newImage.name);
        }

        formData.append('username', JSON.stringify(newUsername));
        const res = await axios.post('/api/update', formData);
        history.push(`/${res.data.username}`);
    };

    useEffect(() => {
        fetchProfile();
    }, []);

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
                    <StyledButton
                        padding="12px 40px"
                        fontSize="1em"
                        margin="50px 20px"
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
