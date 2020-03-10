import React, { useState, useEffect, useCallback } from 'react';
import MODAXIOS from '../config/modaxios';
import { useParams } from 'react-router-dom';
import HumItem from '../components/Hums/HumItem';
import styled from 'styled-components';
import { getAPIURL } from '../config/api';
import { Hum } from '../components/Hums/HumList';

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    width: 100%;
`;

const ViewHum: React.FC = () => {
    const { humID } = useParams();
    const [hum, setHum] = useState<Hum | null>(null);

    const fetchHum = useCallback(async (): Promise<any> => {
        const res = await MODAXIOS.get(getAPIURL() + `/api/hum/${humID}`);
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
