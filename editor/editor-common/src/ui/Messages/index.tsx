/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { G400, N200, R400 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { ThemeProps } from '@atlaskit/theme/types';
import { h200 } from '@atlaskit/theme/typography';

const errorColor = css`
  color: ${R400};
`;

const validColor = css`
  color: ${G400};
`;

const messageStyle = (props: ThemeProps) => css`
  ${h200(props)} font-weight: normal;
  color: ${N200};
  margin-top: ${gridSize() / 2}px;
  display: flex;
  justify-content: baseline;
`;

const iconWrapperStyle = css`
  display: flex;
  margin-right: 4px;
`;

interface Props {
  /** The content of the message */
  children: ReactNode;
}

export const HelperMessage = ({ children }: Props) => (
  <div css={messageStyle}>{children}</div>
);

export const ErrorMessage = ({ children }: Props) => (
  <div
    css={(theme: ThemeProps) => {
      return [messageStyle(theme), errorColor];
    }}
  >
    <span css={iconWrapperStyle}>
      <ErrorIcon size="small" label="error" aria-label="error" />
    </span>
    {children}
  </div>
);

export const ValidMessage = ({ children }: Props) => (
  <div
    css={(theme: ThemeProps) => {
      return [messageStyle(theme), validColor];
    }}
  >
    <span css={iconWrapperStyle}>
      <SuccessIcon size="small" label="success" />
    </span>
    {children}
  </div>
);
