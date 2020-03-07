import React from 'react';
import styled from 'styled-components';

const StyledSpinner = styled.div`
    display: inline-block;
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.98);
    margin: auto;
    border-radius: 50%;
    border-top-color: #70b5db;
    animation: spin 1s ease-in-out infinite;
    -webkit-animation: spin 1s ease-in-out infinite;

    @keyframes spin {
        to {
            -webkit-transform: rotate(360deg);
        }
    }
    @-webkit-keyframes spin {
        to {
            -webkit-transform: rotate(360deg);
        }
    }
`;

const Spinner = () => {
    return <StyledSpinner></StyledSpinner>;
};

export default Spinner;
