import { css } from 'styled-components';

const size = {
    small: 400,
    medium: 600,
    large: 800,
    alt: 630
};

const media = Object.keys(size).reduce((acc, label) => {
    acc[label] = (...args) => css`
        @media (max-width: ${size[label]}px) {
            ${css(...args)}
        }
    `;
    return acc;
}, {});

export { media as default };
