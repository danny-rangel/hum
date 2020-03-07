import React from 'react';
import styled from 'styled-components';
import { ReactComponent as CloseIcon } from '../../icons/close.svg';

export const StyledErrorMessage = styled.span`
    font-size: 0.8em;
    color: white;
    font-weight: 100;
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 300px;
    height: 70px;
    background-color: #ff2b2b;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 2px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px,
        rgba(0, 0, 0, 0.14) 0px 4px 5px 0px,
        rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;

    animation: slideDown 1s;

    @keyframes slideDown {
        from {
            right: 1000px;
        }
        to {
            right: 20px;
        }
    }
`;

export const ErrorButton = styled.button`
    cursor: pointer;
    border: none;
    margin: 0px 12px 30px 0px;
    background: transparent;
    font-weight: 900;
    font-size: 1.2em;
    font-family: Khula;
`;

const StyledError = ({ message, setShowError }) => {
    return (
        <StyledErrorMessage>
            <h3
                style={{
                    margin: 'auto',
                    color: '#ffffff',
                    letterSpacing: '0px',
                    fontWeight: '600'
                }}
            >
                {message}
            </h3>
            <ErrorButton
                onClick={() => setShowError(false)}
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    margin: '10px',
                    width: '20px',
                    height: '20px',
                    padding: 0
                }}
            >
                <CloseIcon style={{ width: '20px', height: '20px' }} />
            </ErrorButton>
        </StyledErrorMessage>
    );
};

export default StyledError;
