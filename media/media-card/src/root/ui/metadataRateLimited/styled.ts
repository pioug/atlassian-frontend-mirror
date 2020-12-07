import { N300 } from '@atlaskit/theme/colors';
import styled from 'styled-components';
import { generateResponsiveStyles } from '../progressBar/styled';
import { Breakpoint } from '../common';
import { titleBoxHeight } from '../iconWrapper/styled';

export type StyledTextProps = {
  breakpoint: Breakpoint;
  positionBottom: boolean;
  hasTitleBox: boolean;
};

export const MetadataRateLimitedWrapper = styled.div`
  ${({ breakpoint, positionBottom, hasTitleBox }: StyledTextProps) => `
    overflow: hidden;
    color: ${N300};
    display: flex;
    justify-content: center;
    align-items: center;
    width:100%;
    text-align:center;
    margin-top: calc(47px - ${titleBoxHeight(hasTitleBox, breakpoint)});
    ${generateResponsiveStyles(breakpoint, positionBottom, 1)}

  `}
`;

export const PreviewRateLimitedWrapper = styled.div`
  white-space: initial;
  padding-top: 8px;
  padding-right: 10px;
  padding-left: 10px;
  font-size: 0.7em !important;
  line-height: 1.2em !important;
`;
