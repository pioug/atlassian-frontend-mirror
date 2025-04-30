import React from 'react';

import { CardClient as Client } from '@atlaskit/link-provider';

import { mocks } from '../utils/common';
import VRCardView from '../utils/vr-card-view';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(mocks.nounDataSuccess);
	}
}

export const BlockCardNouns = () => (
	<div>
		<VRCardView
			appearance="block"
			client={new CustomClient('staging')}
			url={'https://www.mockurl.com'}
		/>
	</div>
);
