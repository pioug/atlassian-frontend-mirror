import React from 'react';

import { VRTestWrapper } from './utils/vr-test';
import UnresolvedViewTest from './utils/vr-unresolved-views';

export default () => (
  <VRTestWrapper title="Embed card unresolved views">
    <UnresolvedViewTest appearance="embed" />
  </VRTestWrapper>
);
