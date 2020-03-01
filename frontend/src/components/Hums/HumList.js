import React from 'react';
import HumItem from './HumItem';

const HumList = ({ hums, fetchHums }) => {
    const renderHums = () => {
        return hums.map(hum => {
            return <HumItem key={hum.id} hum={hum} fetchHums={fetchHums} />;
        });
    };

    return <>{hums ? renderHums() : null}</>;
};

export default HumList;
