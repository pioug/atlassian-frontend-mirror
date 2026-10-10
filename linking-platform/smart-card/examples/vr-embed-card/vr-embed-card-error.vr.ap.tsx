import React from 'react';

import { ErroredClient } from '@atlaskit/link-test-helpers/smart-card/mocks/clients';

import VRCardView from '../utils/vr-card-view';

export default (): React.JSX.Element => (
	<VRCardView appearance="embed" client={new ErroredClient()} />
);
