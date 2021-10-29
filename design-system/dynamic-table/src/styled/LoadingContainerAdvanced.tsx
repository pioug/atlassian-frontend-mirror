/** @jsx jsx */
import { FC, forwardRef, HTMLProps } from 'react';

import { css, jsx } from '@emotion/core';

import { gridSize } from '@atlaskit/theme/constants';

const containerStyles = css({
  marginBottom: `${gridSize() * 3}px`,
  position: 'relative',
});

export const Container = (props: HTMLProps<HTMLDivElement>) => (
  <div css={containerStyles} {...props} />
);

const spinnerBackdropStyles = css({
  pointerEvents: 'none',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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
