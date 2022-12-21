import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import { generateResponsiveStyles } from '../progressBar/styles';
import { Breakpoint } from '../common';
import { N300 } from '@atlaskit/theme/colors';

export const loadingRateLimitedContainerStyles = css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const warningIconWrapperStyles = css`
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

export const loadingRateLimitedTextWrapperStyles = ({
  breakpoint,
  positionBottom,
}: StyledTextProps) => css`
  margin-top: 10px;
  overflow: hidden;
  color: ${token('color.text.subtlest', N300)};
  display: block;
  width: 100%;
  text-align: center;
  ${generateResponsiveStyles(breakpoint, positionBottom, false, 1)}
`;

loadingRateLimitedTextWrapperStyles.displayName =
  'LoadingRateLimitedTextWrapper';

export const couldntLoadWrapperStyles = css`
  font-weight: 550;
`;

export const errorWrapperStyles = css`
  font-weight: 350;
`;
