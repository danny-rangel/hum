import React, { useState, useContext } from 'react';
import { StyledInput } from './SignUp';
import MODAXIOS from '../config/modaxios';
import styled from 'styled-components';
import { StyledButton } from '../components/Styled/StyledButton';
import UserList from '../components/Users/UserList';
import { RedirectContext } from '../components/App';
import { Redirect } from 'react-router-dom';
import { getAPIURL } from '../config/api';
import { User } from '../components/Users/UserList';

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    height: 100%;
    width: 100%;
`;

const Search: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const redirectContext = useContext(RedirectContext);

    const searchUser = async (e): Promise<any> => {
        e.preventDefault();
        const res = await MODAXIOS.post(getAPIURL() + `/api/search`, {
            username
        });
        setUser(res.data);
    };

    return (
        <>
            {redirectContext.redirect.toLanding ? <Redirect to="/" /> : null}
            <div className="wrapper">
                <StyledDiv>
                    <h1>search</h1>
                    <form
                        method="post"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            alignItems: 'center',
                            margin: '30px 0 0 0'
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
                            margin="20px 0"
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
