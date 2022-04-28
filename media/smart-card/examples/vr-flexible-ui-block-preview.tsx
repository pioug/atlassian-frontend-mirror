import React from 'react';

import { VRTestWrapper } from './utils/vr-test';
import { blockOverrideCss, getCardState } from './utils/flexible-ui';
import FlexibleCard from '../src/view/FlexibleCard';
import { PreviewBlock } from '../src/index';
import { tallImage } from '@atlaskit/media-test-helpers';

const cardState = getCardState({
  image: { '@type': 'Image', url: tallImage },
});

export default () => (
  <VRTestWrapper title="Flexible UI: PreviewBlock">
    <h5>Default</h5>
    <FlexibleCard cardState={cardState} url="link-url">
      <PreviewBlock />
    </FlexibleCard>
    <h5>Override CSS</h5>
    <FlexibleCard cardState={cardState} url="link-url">
      <PreviewBlock overrideCss={blockOverrideCss} />
    </FlexibleCard>
  </VRTestWrapper>
);
