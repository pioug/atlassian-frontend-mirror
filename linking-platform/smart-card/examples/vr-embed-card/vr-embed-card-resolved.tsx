import React from 'react';

import { ResolvedClient } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export default () => (
	<VRCardView appearance="embed" client={new ResolvedClient()} frameStyle="show" />
);
