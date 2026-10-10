import React from 'react';

import { ForbiddenWithObjectRequestAccessClient } from '@atlaskit/link-test-helpers/smart-card/mocks/clients';

import VRCardView from '../utils/vr-card-view';

export default (): React.JSX.Element => (
	<VRCardView
		appearance="embed"
		client={new ForbiddenWithObjectRequestAccessClient()}
		url="https://site.atlassian.net/browse/key-1"
	/>
);
