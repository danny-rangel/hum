import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { RedirectContext } from '../components/App';
import { StyledButton } from '../components/Styled/StyledButton';

import HumList from '../components/Hums/HumList';

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    width: 100%;
`;

const StyledForm = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    max-width: 400px;
    height: 150px;
`;

const StyledTextArea = styled.textarea`
    border: none;
    border-radius: 2px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px,
        rgba(0, 0, 0, 0.14) 0px 4px 5px 0px,
        rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
    margin: 0 0 10px;
    border: none;
    border-radius: 2px;
    font-size: 1em;
    padding: 10px;
    resize: none;
    width: 100%;
    box-sizing: border-box;
`;

const Home = () => {
    const [hums, setHums] = useState(null);
    const [content, setContent] = useState('');
    const [charCount, setCharCount] = useState(50);
    const redirectContext = useContext(RedirectContext);

    const updateContent = e => {
        setContent(e.target.value);
        setCharCount(50 - e.target.value.length);
    };

    const fetchHums = async source => {
        try {
            const res = await axios.get('/api/hums', {
                cancelToken: source.token
            });
            setHums(res.data);
        } catch (err) {
            if (!axios.isCancel(err)) {
                throw err;
            }
        }
    };

    const postHum = async e => {
        e.preventDefault();
        try {
            await axios.post('/api/new/hums', {
                content
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const source = axios.CancelToken.source();
        fetchHums(source);
        return () => {
            source.cancel();
        };
    }, []);

    return (
        <div className="wrapper">
            {redirectContext.redirect.toLanding ? <Redirect to="/" /> : null}
            <StyledDiv>
                <StyledForm method="post">
                    <StyledTextArea
                        name="content"
                        maxlength="50"
                        rows="2"
                        placeholder="what's up?"
                        onChange={e => updateContent(e)}
                    ></StyledTextArea>
                    <span
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}
                    >
                        <StyledButton
                            type="submit"
                            onClick={postHum}
                            fontSize="1em"
                            style={{ width: '30%' }}
                        >
                            post hum
                        </StyledButton>
                        <h2
                            style={{
                                marginRight: '1px',
                                color: charCount < 0 ? 'red' : null
                            }}
                        >
                            {charCount}
                        </h2>
                    </span>
                </StyledForm>
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

export default Home;
