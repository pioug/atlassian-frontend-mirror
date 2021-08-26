import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { generateResponsiveStyles } from '../progressBar/styled';
import { Breakpoint } from '../Breakpoint';
import { N300 } from '@atlaskit/theme/colors';

export const LoadingRateLimitedContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const WarningIconWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
  /* Required to allow end users to select text in the error message */
  cursor: auto;
  user-select: text;
  > svg {
    width: 45px;
  }
`;

export type StyledTextProps = {
  breakpoint: Breakpoint;
  positionBottom: boolean;
};

export const LoadingRateLimitedTextWrapper = styled.div`
  ${({ breakpoint, positionBottom }: StyledTextProps) => `
    margin-top: 10px;
    overflow: hidden;
    color: ${N300};
    display: block;
    width:100%;
    text-align:center;
    ${generateResponsiveStyles(breakpoint, positionBottom, 1)}
  `}
`;

LoadingRateLimitedTextWrapper.displayName = 'LoadingRateLimitedTextWrapper';

export const CouldntLoadWrapper = styled.div`
  font-weight: 550;
`;

export const ErrorWrapper = styled.div`
  font-weight: 350;
`;
