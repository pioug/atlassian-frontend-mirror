/** @jsx jsx */
import { type FC } from 'react';

import { css, jsx } from '@emotion/react';

import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type Stage } from '../types';

const linkStyles = css({
  color: token('color.text', N800),
  cursor: 'pointer',
});

/**
 * __Progress tracker link__
 */
const Link: FC<Stage & { testId?: string }> = ({
  href,
  onClick,
  label,
  testId,
}) => (
  <a css={linkStyles} href={href} onClick={onClick} data-testid={testId}>
    {label}
  </a>
);

export default Link;
