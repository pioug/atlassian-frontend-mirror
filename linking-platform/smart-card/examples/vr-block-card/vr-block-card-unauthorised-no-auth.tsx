import React from 'react';

import { UnAuthClientWithNoAuthFlow } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export const BlockCardUnauthorisedViewWithNoAuth = (): React.JSX.Element => (
	<VRCardView appearance="block" client={new UnAuthClientWithNoAuthFlow()} />
);
