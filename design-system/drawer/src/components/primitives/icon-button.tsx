/** @jsx jsx */

import { FC, MouseEventHandler } from 'react';

import { css, jsx } from '@emotion/core';

import { B50, N30A } from '@atlaskit/theme/colors';
import { gridSize as getGridSize } from '@atlaskit/theme/constants';

const gridSize = getGridSize();

const iconButtonStyles = css({
  display: 'flex',
  width: 5 * gridSize,
  height: 5 * gridSize,
  marginBottom: 2 * gridSize,
  padding: 0,
  alignItems: 'center',
  justifyContent: 'center',
  background: 0,
  border: 0,
  borderRadius: '50%',
  color: 'inherit',
  cursor: 'pointer',
  fontSize: 'inherit',
  lineHeight: 1,
  '&:hover': {
    backgroundColor: N30A,
  },
  '&:active': {
    backgroundColor: B50,
    outline: 0,
  },
});

interface IconButtonProps {
  testId?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const IconButton: FC<IconButtonProps> = ({ children, onClick, testId }) => (
  <button
    type="button"
    css={iconButtonStyles}
    onClick={onClick}
    data-testid={testId}
  >
    {children}
  </button>
);

export default IconButton;
