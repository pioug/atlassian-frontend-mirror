import React from 'react';

import { NotFoundWithSiteAccessExistsClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export default () => (
  <VRCardView
    appearance="embed"
    client={new NotFoundWithSiteAccessExistsClient()}
    url="https://site.atlassian.net/browse/key-1"
  />
);
