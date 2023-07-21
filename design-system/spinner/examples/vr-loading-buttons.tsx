/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import Button, { LoadingButton } from '@atlaskit/button';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { token } from '@atlaskit/tokens';

import Spinner from '../src';

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

const layoutStyles = css({
  width: 100,
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  div: {
    margin: token('space.100', '8px'),
  },
});

export default () => (
  <div
    data-testid="spinner-buttons-container"
    css={[animationStyles, layoutStyles]}
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
