import React from 'react';

import { ForbiddenWithSiteDirectAccessClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export default () => (
	<VRCardView
		appearance="embed"
		client={new ForbiddenWithSiteDirectAccessClient()}
		url="https://site.atlassian.net/browse/key-1"
	/>
);
