/** @jsx jsx */
import type { HTMLAttributes } from 'react';

import { css, jsx } from '@emotion/react';

import FocusRing from '@atlaskit/focus-ring';
import { token } from '@atlaskit/tokens';

import { varDotsMargin, varDotsSize } from './constants';

const commonStyles = css({
  width: `var(${varDotsSize})`,
  height: `var(${varDotsSize})`,
  position: 'relative',
  borderRadius: token('border.radius.circle', '50%'),
  '&::before': {
    display: 'block',
    width: `calc(var(${varDotsSize}) + var(${varDotsMargin}))`,
    height: `calc(var(${varDotsSize}) + var(${varDotsMargin}))`,
    position: 'absolute',
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    top: `calc(-1 * var(${varDotsMargin}) / 2)`,
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    left: `calc(-1 * var(${varDotsMargin}) / 2)`,
    content: '""',
  },
});

const buttonStyles = css({
  padding: token('space.0', '0px'),
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
  // TODO: Remove role="presentation", since div's have no semantics anyway
  // (DSP-11587)
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
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
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...props}
        role="tab"
        type="button"
        css={[commonStyles, buttonStyles]}
      />
    </FocusRing>
  );
};
