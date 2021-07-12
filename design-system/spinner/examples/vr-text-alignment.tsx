/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import Spinner from '../src';

export default function Alignment() {
  return (
    <div
      data-testid="spinner-text-container"
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
      <h1>
        This &lt;h1&gt; element <Spinner size="medium" /> is using h800
      </h1>
      <h2>
        This &lt;h2&gt; element <Spinner /> is using h700
      </h2>
      <h3>
        This &lt;h3&gt; element <Spinner /> is using h600
      </h3>
      <h4>
        This &lt;h4&gt; element <Spinner /> is using h500
      </h4>
      <h5>
        This &lt;h5&gt; element <Spinner /> is using h400
      </h5>
      <h6>
        This &lt;h6&gt; element <Spinner size="small" /> is using h300
      </h6>
      <p>
        This is a paragraph style; the spinner should be middle-aligned with the
        text <Spinner size="small" />
      </p>
    </div>
  );
}
