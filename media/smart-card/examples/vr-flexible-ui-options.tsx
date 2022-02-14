/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';

import { VRTestWrapper } from './utils/vr-test';
import { TitleBlock } from '../src/view/FlexibleCard/components/blocks';
import { SmartLinkSize } from '../src/constants';
import { getCardState } from './utils/flexible-ui';
import FlexibleCard from '../src/view/FlexibleCard';

const cardState = getCardState();
const render = (
  hideBackground = false,
  hideElevation = false,
  hidePadding = false,
  size = SmartLinkSize.Medium,
) => (
  <FlexibleCard
    cardState={cardState}
    ui={{
      hideBackground,
      hideElevation,
      hidePadding,
      size,
    }}
    url="link-url"
  >
    <TitleBlock />
  </FlexibleCard>
);
export default () => (
  <VRTestWrapper title="Flexible UI: Options">
    <h5>Hide background</h5>
    {render(true, false, false)}
    <h5>Hide elevation</h5>
    {render(false, true, false)}
    <h5>Hide padding</h5>
    {render(false, false, true)}
    {Object.values(SmartLinkSize).map((size, idx) => (
      <React.Fragment key={idx}>
        <h5>Size: {size}</h5>
        {render(false, false, false, size)}
      </React.Fragment>
    ))}
  </VRTestWrapper>
);
