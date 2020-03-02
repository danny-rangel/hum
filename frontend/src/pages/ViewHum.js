import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import HumItem from '../components/Hums/HumItem';
import styled from 'styled-components';
import { getAPIURL } from '../config/api';

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

    const fetchHum = useCallback(async () => {
        const res = await axios.get(getAPIURL() + `/api/hum/${humID}`);
        setHum(res.data);
    }, [humID]);

    useEffect(() => {
        fetchHum();
    }, [humID, fetchHum]);

    return (
        <div className="wrapper">
            <StyledDiv>{hum ? <HumItem hum={hum} /> : null}</StyledDiv>
        </div>
    );
};

export default ViewHum;
