/** @jsx jsx */
import type { PropsWithChildren } from 'react';

import { css, jsx } from '@emotion/react';

const buttonWrapperStyles = css({
  display: 'flex',
  padding: 4,
  gap: 8,
  flexWrap: 'wrap',
});

export const ButtonWrapper = ({ children }: PropsWithChildren<{}>) => (
  <div css={buttonWrapperStyles}>{children}</div>
);
