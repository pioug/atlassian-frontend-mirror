import { generateResponsiveStyles } from '../progressBar/styled';
import styled from 'styled-components';
import { keyframes } from 'styled-components';
import { Breakpoint } from '../common';
import { N300 } from '@atlaskit/theme/colors';

export type StyledTextProps = {
  breakpoint: Breakpoint;
  positionBottom: boolean;
};

const breatheAnimation = keyframes`
 0% { opacity: 1}
 50% { opacity: 0.3 }
 100% { opacity: 1; }`;

export const CreatingPreviewText = styled.div`
  ${({ breakpoint, positionBottom }: StyledTextProps) => `
    overflow: hidden;
    position: absolute;
    animation-name: ${breatheAnimation};
    animation-duration: 3.5s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    opacity: 1;
    font-weight: 450;
    color: ${N300};
    display: block;
    width:100%;
    text-align:center;
    ${generateResponsiveStyles(breakpoint, positionBottom, 2)}
`}
`;

CreatingPreviewText.displayName = 'CreatingPreviewText';
