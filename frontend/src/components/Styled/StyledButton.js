import styled from 'styled-components';

export const StyledButton = styled.button`
    background: transparent;
    border-radius: 3px;
    border: 2px solid palevioletred;
    color: palevioletred;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease 0s;

    :hover {
        background-color: palevioletred;
        color: white;
    }
`;
