import styled from 'styled-components';

interface StyledButtonProps {
    padding?: string;
    fontSize?: string;
    margin?: string;
}

export const StyledButton = styled.button<StyledButtonProps>`
    background: transparent;
    border-radius: 0px;
    border: 1px solid palevioletred;
    /* border: 1px solid #70b5db; */
    color: palevioletred;
    /* color: #70b5db; */
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
