import React from 'react';

import { ForbiddenWithSitePendingRequestClient } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export default () => (
	<VRCardView appearance="inline" client={new ForbiddenWithSitePendingRequestClient()} />
);
