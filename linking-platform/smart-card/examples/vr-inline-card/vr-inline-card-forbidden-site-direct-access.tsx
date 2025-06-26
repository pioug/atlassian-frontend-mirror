import React from 'react';

import { ForbiddenWithSiteDirectAccessClient } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export default () => (
	<VRCardView appearance="inline" client={new ForbiddenWithSiteDirectAccessClient()} />
);
