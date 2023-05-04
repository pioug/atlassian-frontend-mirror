import React from 'react';
import fetchMock from 'fetch-mock/cjs/client';

import { SmartCardProvider } from '@atlaskit/link-provider';
import {
  LozengeActionWithPreviewExample,
  VRTestWrapper,
} from './utils/vr-test';
import LozengeAction from '../src/view/FlexibleCard/components/common/lozenge-action';
import {
  getFetchMockInvokeOptions,
  mockNoDataResponse,
} from './utils/invoke-error-responses';

fetchMock.mock(getFetchMockInvokeOptions(mockNoDataResponse));

export default () => (
  <VRTestWrapper title="Action: Lozenge No Data on Load Error State">
    <SmartCardProvider>
      <LozengeAction
        text="To Do"
        action={LozengeActionWithPreviewExample}
        testId="vr-test-lozenge-action"
      />
    </SmartCardProvider>
  </VRTestWrapper>
);
