/** @jsx jsx */
// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { background } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { BORDER_WIDTH } from './constants';

interface IconWrapperProps {
  bgColor?: string;
  children?: ReactNode;
}

const iconWrapperStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  alignContent: 'center',
  borderRadius: '50%',
  overflow: 'hidden',
});

/**
 * __Icon wrapper__
 *
 * An icon wrapper is used internally only.
 */
const IconWrapper: FC<IconWrapperProps> = ({
  bgColor = token('color.background.overlay', background()),
  children,
}) => (
  <span
    css={iconWrapperStyles}
    style={{
      border: `${BORDER_WIDTH}px solid ${bgColor}`,
      backgroundColor: bgColor,
    }}
  >
    {children}
  </span>
);

export default IconWrapper;
