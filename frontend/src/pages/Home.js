import React, { useState, useEffect } from 'react';
import axios from 'axios';

import HumList from '../components/Hums/HumList';

const Home = () => {
    const [hums, setHums] = useState(null);
    const [content, setContent] = useState('');

    const fetchHums = async () => {
        try {
            const res = await axios.get('/api/hums');
            setHums(res.data);
        } catch (err) {
            console.log(err);
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
        fetchHums();
    }, []);

    return (
        <div>
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
        </div>
    );
};

export default Home;
