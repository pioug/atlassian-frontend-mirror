import VRTestWrapper from '../utils/vr-test-wrapper';
import React from 'react';

import { Provider, Client, type ResolveResponse } from '../../src';
import { Card } from '../../src';
import { mockUnauthorisedResponse } from '../../src/view/HoverCard/__tests__/__mocks__/mocks';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(mockUnauthorisedResponse as ResolveResponse);
	}
}

export default () => (
	<VRTestWrapper>
		<Provider client={new CustomClient('staging')}>
			<Card
				url={'https://www.mockurl.com'}
				appearance="inline"
				showAuthTooltip={true}
				testId="test-card"
			/>
		</Provider>
	</VRTestWrapper>
);
