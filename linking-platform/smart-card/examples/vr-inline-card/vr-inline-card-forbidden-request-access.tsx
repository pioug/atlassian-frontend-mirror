import React from 'react';

import VRCardView from '../utils/vr-card-view';
import { ForbiddenWithObjectRequestAccessClient } from '../utils/custom-client';

export default () => (
	<VRCardView appearance="inline" client={new ForbiddenWithObjectRequestAccessClient()} />
);
