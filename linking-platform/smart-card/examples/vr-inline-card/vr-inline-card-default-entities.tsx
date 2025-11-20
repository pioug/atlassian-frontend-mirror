import React from 'react';

import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';

import { Card } from '../../src';
import { mocks } from '../utils/common';
import VRTestWrapper from '../utils/vr-test-wrapper';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(mocks.entityDataSuccess);
	}
}

export default (): React.JSX.Element => (
	<VRTestWrapper>
		<Provider client={new CustomClient('staging')}>
			<Card url={'https://www.mockurl.com'} appearance="inline" showHoverPreview={true} />
		</Provider>
	</VRTestWrapper>
);
