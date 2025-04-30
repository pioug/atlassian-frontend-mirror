import React from 'react';

import { CardClient as Client } from '@atlaskit/link-provider';

import { mocks } from '../utils/common';
import VRCardView from '../utils/vr-card-view';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(mocks.nounDataSuccess);
	}
}

export default () => (
	<VRCardView appearance="embed" client={new CustomClient('staging')} frameStyle="show" />
);
