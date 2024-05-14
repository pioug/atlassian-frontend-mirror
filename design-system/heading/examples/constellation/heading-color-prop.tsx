/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { Stack } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import Heading from '../../src';

export default () => {
  return (
    <Stack space="space.100">
      {/**
        * Purposefully not using a Box in order to show manaully setting Heading color
        */}
      <div css={containerStylesBrandBoldest}>
        <Heading size="large" color='color.text.inverse'>
          Heading color can be manually inverted.
        </Heading>
      </div>
      <div css={containerStylesWarningBold}>
        <Heading size="large" color='color.text.warning.inverse'>
          Heading color can be manually inverted.
        </Heading>
      </div>
    </Stack>
  );
};

const containerStylesBrandBoldest = css({
  padding: token('space.200'),
  backgroundColor: token('color.background.brand.boldest')
})

const containerStylesWarningBold = css({
  padding: token('space.200'),
  backgroundColor: token('color.background.warning.bold')
})
