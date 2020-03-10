import React, { useContext } from 'react';
import styled from 'styled-components';
import { RedirectContext } from '../components/App';
import { Redirect } from 'react-router-dom';
import { StyledButton } from '../components/Styled/StyledButton';
import { Link } from 'react-router-dom';

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: center;
`;

const Landing: React.FC = () => {
    const redirectContext = useContext(RedirectContext);

    return (
        <>
            {!redirectContext.redirect.toLanding ? (
                <Redirect to="/home" />
            ) : null}
            <div className="wrapper">
                <StyledDiv>
                    <h1
                        className="line-under"
                        style={{ fontSize: '9em', margin: '100px 0 60px' }}
                    >
                        HUM
                    </h1>
                    <Link to="/signup">
                        <StyledButton
                            padding="12px 50px"
                            fontSize="1em"
                            margin="20px 0"
                        >
                            sign up
                        </StyledButton>
                    </Link>
                </StyledDiv>
            </div>
        </>
    );
};

export default Landing;
