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
  pointerEvents: 'none',
  opacity: `var(${CSS_VAR_CONTENTS_OPACITY})`,
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
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const SpinnerContainer: FC = ({ children }) => (
  <div css={spinnerContainerStyles}>{children}</div>
);
