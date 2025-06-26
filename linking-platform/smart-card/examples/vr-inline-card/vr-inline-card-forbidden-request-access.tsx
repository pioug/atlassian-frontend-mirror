import React from 'react';

import { ForbiddenWithObjectRequestAccessClient } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export default () => (
	<VRCardView appearance="inline" client={new ForbiddenWithObjectRequestAccessClient()} />
);
