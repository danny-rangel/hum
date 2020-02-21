import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import HumList from './Hums/HumList';

const App = () => {
    const [hums, setHums] = useState([]);

    const fetchHums = async () => {
        const res = await axios.get('/api/hums');
        setHums(res.data);
    };

    useEffect(() => {
        fetchHums();
    }, []);

    return (
        <div className="App">
            <header className="App-header">hum</header>
            <HumList hums={hums} />
        </div>
    );
};

export default App;
