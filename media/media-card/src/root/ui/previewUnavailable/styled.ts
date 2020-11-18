import { generateResponsiveStyles } from '../progressBar/styled';
import styled from 'styled-components';
import { Breakpoint } from '../common';
import { N300 } from '@atlaskit/theme/colors';

export type StyledTextProps = {
  breakpoint: Breakpoint;
  positionBottom: boolean;
};

export const PreviewUnavailableText = styled.div`
  ${({ breakpoint, positionBottom }: StyledTextProps) => `
    overflow: hidden;
    position: absolute;
    opacity: 1;
    font-weight: 450;
    color: ${N300};
    display: block;
    width:100%;
    text-align:center;
    ${generateResponsiveStyles(breakpoint, positionBottom, 2)}

`}
`;

PreviewUnavailableText.displayName = 'PreviewUnavailableText';
