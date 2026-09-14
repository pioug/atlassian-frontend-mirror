import React from 'react';

import Client from '@atlaskit/link-provider/client';

import { mocks } from '../utils/common';
import VRCardView from '../utils/vr-card-view';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(mocks.entityDataSuccess);
	}
}

export default (): React.JSX.Element => (
	<VRCardView appearance="embed" client={new CustomClient('staging')} frameStyle="show" />
);
