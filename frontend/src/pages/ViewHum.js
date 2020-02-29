import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import HumItem from '../components/Hums/HumItem';
import styled from 'styled-components';

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    width: 100%;
`;

const ViewHum = () => {
    const { humID } = useParams();
    const [hum, setHum] = useState(null);

    const fetchHum = async () => {
        const res = await axios.get(`/api/hum/${humID}`);
        setHum(res.data);
    };

    useEffect(() => {
        fetchHum();
    }, [humID]);

    return (
        <div className="wrapper">
            <StyledDiv>{hum ? <HumItem hum={hum} /> : null}</StyledDiv>
        </div>
    );
};

export default ViewHum;
