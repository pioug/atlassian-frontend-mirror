import React from 'react';

import { ForbiddenWithObjectRequestAccessClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export default () => (
	<VRCardView appearance="inline" client={new ForbiddenWithObjectRequestAccessClient()} />
);
