/* eslint-disable @repo/internal/react/require-jsdoc */
/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/react';

export const CSS_VAR_CONTENTS_OPACITY = '--contents-opacity';

type LoadingContainerProps = {
  contentsOpacity: number;
  testId?: string;
};

const containerStyles = css({
  position: 'relative',
});

export const Container: FC<{ testId?: string }> = ({ children, testId }) => (
  <div css={containerStyles} data-testid={testId && `${testId}--container`}>
    {children}
  </div>
);

const contentsContainerStyles = css({
  opacity: `var(${CSS_VAR_CONTENTS_OPACITY})`,
  pointerEvents: 'none',
});

export const ContentsContainer: FC<LoadingContainerProps> = ({
  children,
  contentsOpacity,
  testId,
}) => (
  <div
    style={
      { [CSS_VAR_CONTENTS_OPACITY]: contentsOpacity } as React.CSSProperties
    }
    css={[contentsContainerStyles]}
    data-testid={testId && `${testId}--contents--container`}
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

export const SpinnerContainer: FC<{ testId?: string }> = ({
  children,
  testId,
}) => (
  <div
    css={spinnerContainerStyles}
    data-testid={testId && `${testId}--spinner--container`}
  >
    {children}
  </div>
);
