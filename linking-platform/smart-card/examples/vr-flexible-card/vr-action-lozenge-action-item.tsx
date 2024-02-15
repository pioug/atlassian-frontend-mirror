import React from 'react';
import { SmartCardProvider } from '@atlaskit/link-provider';
import VRTestWrapper from '../utils/vr-test-wrapper';
import LozengeActionItem from '../../src/view/FlexibleCard/components/elements/lozenge/lozenge-action/lozenge-action-item';

export default () => (
  <VRTestWrapper>
    <SmartCardProvider>
      <LozengeActionItem
        id="test-smart-element-lozenge-dropdown"
        text="To Do"
        appearance="default"
      />
    </SmartCardProvider>
  </VRTestWrapper>
);
