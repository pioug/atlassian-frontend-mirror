import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { LozengeActionExample, VRTestWrapper } from './utils/vr-test';
import LozengeAction from '../src/view/FlexibleCard/components/elements/lozenge/lozenge-action';
import './utils/fetch-mock-invoke';

export default () => (
  <VRTestWrapper title="Action: Lozenge">
    <SmartCardProvider>
      <LozengeAction
        text="To Do"
        action={LozengeActionExample}
        testId="vr-test-lozenge-action"
      />
    </SmartCardProvider>
  </VRTestWrapper>
);
