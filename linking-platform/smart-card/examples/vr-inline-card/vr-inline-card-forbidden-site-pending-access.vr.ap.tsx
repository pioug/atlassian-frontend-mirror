import React from 'react';

import { ForbiddenWithSitePendingRequestClient } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export default (): React.JSX.Element => (
	<VRCardView appearance="inline" client={new ForbiddenWithSitePendingRequestClient()} />
);
