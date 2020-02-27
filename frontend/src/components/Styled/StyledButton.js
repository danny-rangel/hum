import styled from 'styled-components';

export const StyledButton = styled.button`
    background: transparent;
    border-radius: 0px;
    border: 1px solid palevioletred;
    color: palevioletred;
    cursor: pointer;
    transition: all 0.3s ease 0s;
    padding: ${props => props.padding};
    font-size: ${props => props.fontSize};
    margin: ${props => props.margin};

    :hover {
        background-color: palevioletred;
        color: white;
    }
`;
