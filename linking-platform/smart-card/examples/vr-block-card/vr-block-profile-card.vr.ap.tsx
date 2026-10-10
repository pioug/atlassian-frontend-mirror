import React from 'react';

import {
	ResolvedClient,
	ResolvedClientProfileUrl,
} from '@atlaskit/link-test-helpers/smart-card/mocks/clients';

import VRCardView from '../utils/vr-card-view';

export const VRBlockProfileCard = (): React.JSX.Element => (
	<VRCardView appearance="block" url={ResolvedClientProfileUrl} client={new ResolvedClient()} />
);
