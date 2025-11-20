import React from 'react';

import { UnAuthClientWithProviderImage } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export default (): React.JSX.Element => (
	<VRCardView appearance="embed" client={new UnAuthClientWithProviderImage()} />
);
