import React from 'react';

import VRCardView from '../utils/vr-card-view';
import { ForbiddenWithSiteDeniedRequestClient } from '../utils/custom-client';

export default () => (
	<VRCardView appearance="inline" client={new ForbiddenWithSiteDeniedRequestClient()} />
);
