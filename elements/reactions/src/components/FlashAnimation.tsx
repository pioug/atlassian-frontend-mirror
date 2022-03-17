/** @jsx jsx */
import { jsx, css, keyframes } from '@emotion/core';
import { B75, B300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import React from 'react';

export type Props = {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  flash?: boolean;
};

export const flashAnimationTestId = 'flash-animation';

const containerStyle = css({
  width: '100%',
  height: '100%',
});

const flashTime = 700;

export const flashAnimation = keyframes({
  '0%': {
    backgroundColor: 'transparent',
  },
  '20%': {
    backgroundColor: token('color.background.selected.pressed', B75),
    borderColor: token('color.border.selected', B300),
  },
  '75%': {
    backgroundColor: token('color.background.selected.pressed', B75),
    borderColor: token('color.border.selected', B300),
  },
  '100%': {
    backgroundColor: token('color.background.selected.pressed', B75),
    borderColor: token('color.border.selected', B300),
  },
});

export const flashStyle = css({
  animation: `${flashAnimation} ${flashTime}ms ease-in-out`,
});

/**
 * Flash animation background component. See Reaction component for usage.
 */
export const FlashAnimation = (props: Props) => (
  <div
    className={props.className}
    css={[containerStyle, props.flash && flashStyle]}
    data-testid={flashAnimationTestId}
  >
    {props.children}
  </div>
);
