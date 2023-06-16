import React from 'react';
import fetchMock from 'fetch-mock/cjs/client';

import { SmartCardProvider } from '@atlaskit/link-provider';
import {
  LozengeActionWithPreviewExample,
  VRTestWrapper,
} from './utils/vr-test';
import LozengeAction from '../src/view/FlexibleCard/components/elements/lozenge/lozenge-action';
import {
  getFetchMockInvokeOptions,
  mockSuccessfulLoadResponse,
  mockUpdateFailedResponse,
} from './utils/invoke-error-responses';

fetchMock.mock(
  getFetchMockInvokeOptions(
    mockSuccessfulLoadResponse,
    mockUpdateFailedResponse,
  ),
);

export default () => (
  <VRTestWrapper title="Action: Lozenge Update Failed Error">
    <SmartCardProvider>
      <LozengeAction
        text="To Do"
        action={LozengeActionWithPreviewExample}
        testId="vr-test-lozenge-action"
      />
    </SmartCardProvider>
  </VRTestWrapper>
);
