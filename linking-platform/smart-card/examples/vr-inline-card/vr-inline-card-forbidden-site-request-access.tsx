import React from 'react';

import { ForbiddenWithSiteRequestAccessClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export default () => (
	<VRCardView appearance="inline" client={new ForbiddenWithSiteRequestAccessClient()} />
);
