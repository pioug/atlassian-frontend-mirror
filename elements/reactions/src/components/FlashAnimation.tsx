import { B75 } from '@atlaskit/theme/colors';
import cx from 'classnames';
import React from 'react';
import { keyframes, style } from 'typestyle';

export type Props = {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  flash?: boolean;
};

const containerStyle = style({
  width: '100%',
  height: '100%',
});

const flashTime = 700;

const flashAnimation = keyframes({
  '0%': {
    backgroundColor: 'transparent',
  },
  '20%': {
    backgroundColor: B75,
  },
  '75%': {
    backgroundColor: B75,
  },
  '100%': {
    backgroundColor: 'transparent',
  },
});

export const flashStyle = style({
  animation: `${flashAnimation} ${flashTime}ms ease-in-out`,
});

/**
 * Flash animation background component. See Reaction component for usage.
 */
export const FlashAnimation = (props: Props) => (
  <div
    className={cx(containerStyle, props.className, {
      [flashStyle]: props.flash,
    })}
  >
    {props.children}
  </div>
);
