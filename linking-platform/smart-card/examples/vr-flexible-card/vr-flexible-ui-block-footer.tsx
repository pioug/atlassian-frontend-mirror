/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { FooterBlock } from '../../src/view/FlexibleCard/components/blocks';
import { SmartLinkSize } from '../../src/constants';
import {
  blockOverrideCss,
  getCardState,
  makeCustomActionItem,
  makeDeleteActionItem,
  makeDownloadActionItem,
  makeEditActionItem,
  makeViewActionItem,
} from '../utils/flexible-ui';
import FlexibleCard from '../../src/view/FlexibleCard';
import { ActionItem } from '../../src';
import PremiumIcon from '@atlaskit/icon/glyph/premium';
import VRTestWrapper from '../utils/vr-test-wrapper';

const renderFooter = (size?: SmartLinkSize, actions?: ActionItem[]) => {
  const actionData = {
    preview: {
      '@type': 'Link',
      href: 'https://www.youtube.com/embed/tt5VPYoop5Y',
      'atlassian:supportedPlatforms': ['web'],
    },
    'atlassian:downloadUrl':
      'https://www.dropbox.com/s/0ebs1wkexeta5ml/Get%20Started%20with%20Dropbox.pdf?dl=1',
    'schema:potentialAction': [
      { '@type': 'DownloadAction', name: 'Download' },
      { '@type': 'ViewAction', name: 'View' },
    ],
  };
  const cardState = getCardState({ data: actionData });
  return (
    <FlexibleCard cardState={cardState} ui={{ size }} url="link-url">
      <FooterBlock size={size} actions={actions} />
    </FlexibleCard>
  );
};

const actions: ActionItem[] = [makeDeleteActionItem()];

export default () => (
  <VRTestWrapper>
    <SmartCardProvider>
      <h5>Default</h5>
      {renderFooter()}
      <h5>With two actions</h5>
      {renderFooter(SmartLinkSize.Medium, [
        makeDeleteActionItem(),
        makeEditActionItem(),
      ])}
      <h5>With 3+ Custom actions</h5>
      {renderFooter(SmartLinkSize.Medium, [
        makeCustomActionItem(),
        makeDeleteActionItem(),
        makeCustomActionItem({
          icon: <PremiumIcon label="magic" />,
          testId: 'third-action-item',
          content: 'Magic!',
        }),
        makeDownloadActionItem(),
        makeViewActionItem(),
      ])}
      {Object.values(SmartLinkSize).map((size) => (
        <React.Fragment>
          <h5>Size: {size}</h5>
          {renderFooter(size, actions)}
        </React.Fragment>
      ))}
      <h5>Override CSS</h5>
      <FlexibleCard cardState={getCardState()} url="link-url">
        <FooterBlock overrideCss={blockOverrideCss} />
      </FlexibleCard>
    </SmartCardProvider>
  </VRTestWrapper>
);
