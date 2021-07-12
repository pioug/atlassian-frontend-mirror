/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import Spinner from '../src';

export default () => (
  <div
    css={css`
      // For VR testing purposes we are overriding the animation timing
      // for both the fade-in and the rotating animations. This will
      // freeze the spinner, avoiding potential for VR test flakiness.
      span,
      svg {
        animation-timing-function: step-end;
        animation-duration: 0s;
      }
    `}
  >
    <Spinner testId="spinner" />
  </div>
);
