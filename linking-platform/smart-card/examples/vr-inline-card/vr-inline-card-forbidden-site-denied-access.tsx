import React from 'react';

import { ForbiddenWithSiteDeniedRequestClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export default () => (
	<VRCardView appearance="inline" client={new ForbiddenWithSiteDeniedRequestClient()} />
);
