import React, { useState, useEffect } from 'react';
import axios from 'axios';

import HumList from '../components/Hums/HumList';

const Home = () => {
    const [hums, setHums] = useState(null);

    const fetchHums = async () => {
        try {
            const res = await axios.get('/api/hums');
            setHums(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchHums();
    }, []);

    return (
        <div>
            <HumList hums={hums} />
        </div>
    );
};

export default Home;
