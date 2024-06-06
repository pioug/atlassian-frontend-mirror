import React from 'react';

import { ForbiddenWithSiteDeniedRequestClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export default () => (
	<VRCardView
		appearance="embed"
		client={new ForbiddenWithSiteDeniedRequestClient()}
		url="https://site.atlassian.net/browse/key-1"
	/>
);
