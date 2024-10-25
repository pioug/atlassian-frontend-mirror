import React from 'react';

import { ForbiddenWithSiteDirectAccessClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export default () => (
	<VRCardView appearance="inline" client={new ForbiddenWithSiteDirectAccessClient()} />
);
