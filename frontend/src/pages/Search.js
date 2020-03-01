import React, { useState, useContext } from 'react';
import { StyledInput } from './SignUp';
import axios from 'axios';
import styled from 'styled-components';
import { StyledButton } from '../components/Styled/StyledButton';
import UserList from '../components/Users/UserList';
import { RedirectContext } from '../components/App';
import { Redirect } from 'react-router-dom';

const StyledDiv = styled.div`
    display: grid;
    grid-template-rows: 60px 150px 1fr;
    grid-template-columns: 1fr;
    height: 100%;
    align-items: center;
    justify-content: center;
    width: 100%;
`;

const Search = () => {
    const [username, setUsername] = useState('');
    const [user, setUser] = useState(null);
    const redirectContext = useContext(RedirectContext);

    const searchUser = async e => {
        e.preventDefault();
        const res = await axios.post(`/api/search`, {
            username
        });
        setUser(res.data);
    };

    return (
        <>
            {redirectContext.redirect.toLanding ? <Redirect to="/" /> : null}
            <div className="wrapper">
                <StyledDiv>
                    <h1 style={{ justifySelf: 'center' }}>search</h1>
                    <form
                        method="post"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            height: '100%',
                            justifyContent: 'space-evenly',
                            alignItems: 'center'
                        }}
                    >
                        <StyledInput
                            type="text"
                            name="username"
                            required
                            onChange={e => setUsername(e.target.value)}
                            value={username}
                            placeholder="search for user by username"
                        ></StyledInput>
                        <StyledButton
                            style={{ width: '100%', maxWidth: '200px' }}
                            padding="10px 20px"
                            fontSize="1.2em"
                            onClick={e => searchUser(e)}
                        >
                            search
                        </StyledButton>
                    </form>
                    {user ? (
                        user.id === '' ? (
                            <h2
                                style={{
                                    justifySelf: 'center',
                                    alignSelf: 'start'
                                }}
                            >
                                No users found.
                            </h2>
                        ) : (
                            <UserList users={[user]} />
                        )
                    ) : null}
                </StyledDiv>
            </div>
        </>
    );
};

export default Search;