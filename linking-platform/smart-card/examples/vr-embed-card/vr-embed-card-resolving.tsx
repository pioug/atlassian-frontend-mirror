import React from 'react';

import { ResolvingClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export default () => (
	<VRCardView appearance="embed" client={new ResolvingClient()} frameStyle="show" />
);
