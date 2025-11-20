import React from 'react';

import { NotFoundWithSiteAccessExistsClient } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export default (): React.JSX.Element => (
	<VRCardView
		appearance="embed"
		client={new NotFoundWithSiteAccessExistsClient()}
		url="https://site.atlassian.net/browse/key-1"
	/>
);
