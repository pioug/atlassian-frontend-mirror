/** @jsx jsx */
import type { HTMLAttributes } from 'react';

import { css, jsx } from '@emotion/core';

import FocusRing from '@atlaskit/focus-ring';

import { varDotsMargin, varDotsSize } from './constants';

const commonStyles = css({
  width: `var(${varDotsSize})`,
  height: `var(${varDotsSize})`,
  position: 'relative',
  borderRadius: '50%',
  '&::before': {
    display: 'block',
    width: `calc(var(${varDotsSize}) + var(${varDotsMargin}))`,
    height: `calc(var(${varDotsSize}) + var(${varDotsMargin}))`,
    position: 'absolute',
    top: `calc(-1 * var(${varDotsMargin}) / 2)`,
    left: `calc(-1 * var(${varDotsMargin}) / 2)`,
    content: '""',
  },
});

const buttonStyles = css({
  padding: 0,
  border: 0,
  cursor: 'pointer',
  outline: 0,
});

/**
 * __Presentational indicator__
 *
 * A presentational indicator with no interactivity
 */
export const PresentationalIndicator = (
  props: HTMLAttributes<HTMLDivElement>,
) => <div {...props} css={commonStyles} role="presentation" />;

/**
 * __Button indicator__
 *
 * An interactive indicator.
 */
export const ButtonIndicator = (props: HTMLAttributes<HTMLButtonElement>) => {
  return (
    <FocusRing>
      <button
        {...props}
        role="tab"
        type="button"
        css={[commonStyles, buttonStyles]}
      />
    </FocusRing>
  );
};
