/* eslint-disable @repo/internal/react/require-jsdoc */
/** @jsx jsx */
import { FC, forwardRef, HTMLProps } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const containerStyles = css({
  // TODO Delete this comment after verifying spacing token -> previous value ``${gridSize() * 3}px``
  marginBottom: token('spacing.scale.300', '24px'),
  position: 'relative',
});

export const Container = (props: HTMLProps<HTMLDivElement>) => (
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  <div css={containerStyles} {...props} />
);

const spinnerBackdropStyles = css({
  display: 'flex',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
});

export const SpinnerBackdrop: FC = ({ children }) => (
  <div css={spinnerBackdropStyles}>{children}</div>
);

const spinnerContainerStyles = css({
  position: 'relative',
  top: 0,
});

export const SpinnerContainer = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>(({ children }, ref) => (
  <div css={spinnerContainerStyles} ref={ref}>
    {children}
  </div>
));
