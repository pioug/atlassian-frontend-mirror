import React from 'react';
import fetchMock from 'fetch-mock/cjs/client';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { LozengeActionExample, VRTestWrapper } from './utils/vr-test';
import LozengeAction from '../src/view/FlexibleCard/components/common/lozenge-action';
import {
  getFetchMockInvokeOptions,
  mockSuccessfulLoadResponse,
  mockUpdateCustomErrorResponse,
} from './utils/invoke-error-responses';

fetchMock.mock(
  getFetchMockInvokeOptions(
    mockSuccessfulLoadResponse,
    mockUpdateCustomErrorResponse,
  ),
);

export default () => (
  <VRTestWrapper title="Action: Lozenge Update Custom Error without Preview Modal">
    <SmartCardProvider>
      <LozengeAction
        text="To Do"
        action={LozengeActionExample}
        testId="vr-test-lozenge-action"
      />
    </SmartCardProvider>
  </VRTestWrapper>
);
