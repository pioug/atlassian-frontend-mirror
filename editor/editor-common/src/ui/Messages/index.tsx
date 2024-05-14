/** @jsx jsx */
import type { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { G400, N200, R400 } from '@atlaskit/theme/colors';
import { h200 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

const errorColor = css({
  color: token('color.text.danger', R400),
});

const validColor = css({
  color: token('color.text.success', G400),
});

const messageStyle = () =>
  css(h200(), {
    fontWeight: 'normal',
    color: token('color.text.subtlest', N200),
    marginTop: token('space.050', '4px'),
    display: 'flex',
    justifyContent: 'baseline',
  });

const iconWrapperStyle = css({
  display: 'flex',
  marginRight: token('space.050', '4px'),
});

interface Props {
  /** The content of the message */
  children: ReactNode;
}

export const HelperMessage = ({ children }: Props) => (
  <div css={messageStyle}>{children}</div>
);

export const ErrorMessage = ({ children }: Props) => (
  <div
    css={() => {
      return [messageStyle(), errorColor];
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
    css={() => {
      return [messageStyle(), validColor];
    }}
  >
    <span css={iconWrapperStyle}>
      <SuccessIcon size="small" label="success" />
    </span>
    {children}
  </div>
);
