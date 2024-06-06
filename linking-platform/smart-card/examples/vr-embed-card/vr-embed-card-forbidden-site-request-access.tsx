import React from 'react';

import { ForbiddenWithSiteRequestAccessClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export default () => (
	<VRCardView
		appearance="embed"
		client={new ForbiddenWithSiteRequestAccessClient()}
		url="https://site.atlassian.net/browse/key-1"
	/>
);
