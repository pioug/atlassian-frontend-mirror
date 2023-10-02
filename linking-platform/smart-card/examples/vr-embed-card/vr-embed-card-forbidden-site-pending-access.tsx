import React from 'react';

import { ForbiddenWithSitePendingRequestClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export default () => (
  <VRCardView
    appearance="embed"
    client={new ForbiddenWithSitePendingRequestClient()}
    url="https://site.atlassian.net/browse/key-1"
  />
);
