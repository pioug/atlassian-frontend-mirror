import React from 'react';

import { ForbiddenWithObjectRequestAccessClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export default () => (
  <VRCardView
    appearance="embed"
    client={new ForbiddenWithObjectRequestAccessClient()}
    url="https://site.atlassian.net/browse/key-1"
  />
);
