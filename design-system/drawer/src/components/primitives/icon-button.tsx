/** @jsx jsx */
import { FC, MouseEventHandler } from 'react';

import { css, jsx } from '@emotion/react';

import { B50, N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const iconButtonStyles = css({
  padding: token('space.100', '8px'),
  backgroundColor: 'inherit',
  border: 'none',
  borderRadius: token('space.1000', '80px'),
  color: 'inherit',
  cursor: 'pointer',
  lineHeight: token('font.lineHeight.100', '1'),
  '&:hover': {
    backgroundColor: token('color.background.neutral.subtle.hovered', N30A),
  },
  '&:active': {
    backgroundColor: token('color.background.neutral.subtle.pressed', B50),
  },
});

interface IconButtonProps {
  testId?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const IconButton: FC<IconButtonProps> = ({ children, onClick, testId }) => (
  // eslint-disable-next-line @repo/internal/react/use-primitives
  <button
    type="button"
    css={iconButtonStyles}
    onClick={onClick}
    data-testid={testId}
  >
    {children}
  </button>
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default IconButton;
