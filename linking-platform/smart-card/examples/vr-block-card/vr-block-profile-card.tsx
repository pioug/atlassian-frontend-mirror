import React from 'react';

import { ResolvedClient, ResolvedClientProfileUrl } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export const VRBlockProfileCard = () => (
	<VRCardView appearance="block" url={ResolvedClientProfileUrl} client={new ResolvedClient()} />
);
