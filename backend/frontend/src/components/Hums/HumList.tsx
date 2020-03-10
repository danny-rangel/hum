import React from 'react';
import HumItem from './HumItem';

export interface Hum {
    id: string;
    content: string;
    likes: number;
    posted: Date;
    user_id: string;
    username: string;
}

interface HumListProps {
    hums: Hum[];
    fetchHums?: Function;
}

const HumList: React.FC<HumListProps> = ({ hums, fetchHums }) => {
    const renderHums = (): JSX.Element[] => {
        return hums.map(hum => {
            return <HumItem key={hum.id} hum={hum} fetchHums={fetchHums} />;
        });
    };

    return <>{hums ? renderHums() : null}</>;
};

export default HumList;
