import React from 'react';

import { Card, Client, Provider, type ResolveResponse } from '../../src';
import { mockUnauthorisedResponse } from '../../src/view/HoverCard/__tests__/__mocks__/mocks';
import VRTestWrapper from '../utils/vr-test-wrapper';

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
