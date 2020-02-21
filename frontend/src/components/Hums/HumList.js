import React from 'react';
import HumItem from './HumItem';

const HumList = ({ hums }) => {
    const renderHums = () => {
        return hums.map(hum => {
            return <HumItem key={hum.id} hum={hum} />;
        });
    };

    return <>{hums ? renderHums() : null}</>;
};

export default HumList;
