import React, { useContext } from 'react';
import { RedirectContext } from '../components/App';
import { Redirect } from 'react-router-dom';

const Landing = () => {
    const redirectContext = useContext(RedirectContext);

    return (
        <>
            {!redirectContext.redirect.toLanding ? (
                <Redirect to="/home" />
            ) : null}
            Landing
        </>
    );
};

export default Landing;
