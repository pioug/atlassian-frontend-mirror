import React from 'react';

import { type JsonLd } from 'json-ld-types';

import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';

import { Card } from '../../src';
import { mockUnauthorisedResponse } from '../../src/view/HoverCard/__tests__/__mocks__/mocks';
import VRTestWrapper from '../utils/vr-test-wrapper';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(mockUnauthorisedResponse as JsonLd.Response);
	}
}

export default () => (
	<VRTestWrapper>
		<Provider client={new CustomClient('staging')}>
			<Card
				url={'https://www.mockurl.com'}
				appearance="inline"
				showHoverPreview={true}
				testId="test-card"
			/>
		</Provider>
	</VRTestWrapper>
);
