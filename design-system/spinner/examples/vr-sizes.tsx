/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import Spinner, { Size } from '../src';

const sizes: Size[] = ['xsmall', 'small', 'medium', 'large', 'xlarge'];

/**
 * For VR testing purposes we are overriding the animation timing
 * for both the fade-in and the rotating animations. This will
 * freeze the spinner, avoiding potential for VR test flakiness.
 */
const animationStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  'svg, span': {
    animationDuration: '0s',
    animationTimingFunction: 'step-end',
  },
});

export default function Example() {
  return (
    <div data-testid="spinner-sizes-container">
      {sizes.map((size: Size) => (
        <div css={animationStyles}>
          <Spinner size={size} />
        </div>
      ))}
    </div>
  );
}
