import React, { useContext } from 'react';
import { RedirectContext } from '../components/App';
import { Redirect } from 'react-router-dom';
import { StyledButton } from '../components/Styled/StyledButton';
import { Link } from 'react-router-dom';

const Landing = () => {
    const redirectContext = useContext(RedirectContext);

    return (
        <>
            {!redirectContext.redirect.toLanding ? (
                <Redirect to="/home" />
            ) : null}
            <div className="wrapper">
                <h1 className="line-under" style={{ fontSize: '9em' }}>
                    HUM
                </h1>
                <Link to="/signup">
                    <StyledButton padding="12px 50px" fontSize="1em">
                        sign up
                    </StyledButton>
                </Link>
            </div>
        </>
    );
};

export default Landing;
