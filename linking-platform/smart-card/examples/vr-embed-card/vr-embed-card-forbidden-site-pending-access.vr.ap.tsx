import React from 'react';

import { ForbiddenWithSitePendingRequestClient } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export default (): React.JSX.Element => (
	<VRCardView
		appearance="embed"
		client={new ForbiddenWithSitePendingRequestClient()}
		url="https://site.atlassian.net/browse/key-1"
	/>
);
