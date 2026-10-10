import React from 'react';

import { ForbiddenWithSiteDeniedRequestClient } from '@atlaskit/link-test-helpers/smart-card/mocks/clients';

import VRCardView from '../utils/vr-card-view';

export default (): React.JSX.Element => (
	<VRCardView appearance="inline" client={new ForbiddenWithSiteDeniedRequestClient()} />
);
