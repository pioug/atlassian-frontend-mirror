import React from 'react';

import { ForbiddenWithSiteForbiddenClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export default () => (
  <VRCardView
    appearance="embed"
    client={new ForbiddenWithSiteForbiddenClient()}
    url="https://site.atlassian.net/browse/key-1"
  />
);
