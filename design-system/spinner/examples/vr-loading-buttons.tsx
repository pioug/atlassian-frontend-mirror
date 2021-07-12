/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import Button, { LoadingButton } from '@atlaskit/button';
import SearchIcon from '@atlaskit/icon/glyph/search';

import Spinner from '../src';

export default () => (
  <div
    data-testid="spinner-buttons-container"
    css={css`
      width: 100px;
      div {
        margin: 8px;
      }
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
    {/* If you want a Spinner in a Button, you should use `LoadingButton` */}
    <div>
      <LoadingButton isLoading={true} appearance="primary">
        Button
      </LoadingButton>
    </div>
    <div>
      <LoadingButton
        isLoading={true}
        appearance="primary"
        iconBefore={<SearchIcon label="Search" />}
      />
    </div>

    {/* There are other ways to put a Spinner inside a Button, but none of these
      are recommended. We are visual regression testing them all the same so
      that we'll be made aware if a change will break outdated button usages. */}
    <div>
      <Button appearance="primary" overlay={<Spinner appearance="invert" />}>
        Button
      </Button>
    </div>
    <div>
      <Button
        appearance="primary"
        iconBefore={<Spinner appearance="invert" />}
      />
    </div>
    <div>
      <Button
        appearance="primary"
        iconAfter={<Spinner appearance="invert" />}
      />
    </div>
  </div>
);
