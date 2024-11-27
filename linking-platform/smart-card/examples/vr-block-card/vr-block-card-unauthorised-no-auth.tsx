import React from 'react';

import { UnAuthClientWithNoAuthFlow } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export const BlockCardUnauthorisedViewWithNoAuth = () => (
	<VRCardView appearance="block" client={new UnAuthClientWithNoAuthFlow()} />
);
