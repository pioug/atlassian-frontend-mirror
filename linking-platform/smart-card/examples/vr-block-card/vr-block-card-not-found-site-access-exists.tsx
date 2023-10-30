import { css } from '@emotion/react';
import React from 'react';

import { NotFoundWithSiteAccessExistsClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

const containerStyles = css`
  width: 760px;
`;
export default () => (
  <VRCardView
    appearance="block"
    client={new NotFoundWithSiteAccessExistsClient()}
    overrideCss={containerStyles}
    url="https://site.atlassian.net/browse/key-1"
  />
);
