/* eslint-disable @repo/internal/react/require-jsdoc */
/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/core';

const CSS_VAR_CONTENTS_OPACITY = '--contents-opacity';

type LoadingContainerProps = {
  contentsOpacity: number;
};

const containerStyles = css({
  position: 'relative',
});

export const Container: FC = ({ children }) => (
  <div css={containerStyles}>{children}</div>
);

const contentsContainerStyles = css({
  opacity: `var(${CSS_VAR_CONTENTS_OPACITY})`,
  pointerEvents: 'none',
});

export const ContentsContainer: FC<LoadingContainerProps> = ({
  contentsOpacity,
  children,
}) => (
  <div
    style={
      { [CSS_VAR_CONTENTS_OPACITY]: contentsOpacity } as React.CSSProperties
    }
    css={[contentsContainerStyles]}
  >
    {children}
  </div>
);

const spinnerContainerStyles = css({
  display: 'flex',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  alignItems: 'center',
  justifyContent: 'center',
});

export const SpinnerContainer: FC = ({ children }) => (
  <div css={spinnerContainerStyles}>{children}</div>
);
