import React from 'react';

import { ForbiddenWithSiteDeniedRequestClient } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export default (): React.JSX.Element => (
	<VRCardView
		appearance="embed"
		client={new ForbiddenWithSiteDeniedRequestClient()}
		url="https://site.atlassian.net/browse/key-1"
	/>
);
