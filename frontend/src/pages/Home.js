import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { RedirectContext } from '../components/App';

import HumList from '../components/Hums/HumList';

const Home = () => {
    const [hums, setHums] = useState(null);
    const [content, setContent] = useState('');
    const redirectContext = useContext(RedirectContext);

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
        <>
            {redirectContext.redirect.toLanding ? <Redirect to="/" /> : null}
            <form method="post">
                <textarea
                    name="content"
                    onChange={e => setContent(e.target.value)}
                ></textarea>
                <button type="submit" onClick={postHum}>
                    Post
                </button>
            </form>
            <HumList hums={hums} />
        </>
    );
};

export default Home;
