/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';

import { VRTestWrapper } from './utils/vr-test';
import { FooterBlock } from '../src/view/FlexibleCard/components/blocks';
import { ActionName, SmartLinkSize } from '../src/constants';
import { getCardState } from './utils/flexible-ui';
import FlexibleCard from '../src/view/FlexibleCard';
import { ActionItem } from '../src';

const renderFooter = (size?: SmartLinkSize, actions?: ActionItem[]) => {
  const cardState = getCardState();
  return (
    <FlexibleCard cardState={cardState} ui={{ size }} url="link-url">
      <FooterBlock size={size} actions={actions} />
    </FlexibleCard>
  );
};

const actions: ActionItem[] = [
  {
    name: ActionName.DeleteAction,
    hideIcon: true,
    onClick: () => console.log('delete'),
  },
];

export default () => (
  <VRTestWrapper title="Flexible UI: FooterBlock">
    <h5>Default</h5>
    {renderFooter()}
    {Object.values(SmartLinkSize).map((size) => (
      <React.Fragment>
        <h5>Size: {size}</h5>
        {renderFooter(size, actions)}
      </React.Fragment>
    ))}
  </VRTestWrapper>
);
