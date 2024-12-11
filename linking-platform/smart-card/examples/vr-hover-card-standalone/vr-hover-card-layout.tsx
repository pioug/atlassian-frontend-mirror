import React from 'react';

import { type JsonLd } from 'json-ld-types';

import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';

import { mockConfluenceResponse } from '../../src/view/HoverCard/__tests__/__mocks__/mocks';
import { HoverCardComponent } from '../../src/view/HoverCard/components/HoverCardComponent';
import VRTestWrapper from '../utils/vr-test-wrapper';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(mockConfluenceResponse as JsonLd.Response);
	}
}

export default () => (
	<VRTestWrapper>
		<Provider
			client={new CustomClient('staging')}
			featureFlags={{ enableImprovedPreviewAction: true }}
		>
			<HoverCardComponent url="https://www.mockurl.com" noFadeDelay={true}>
				<button>Hover over me!</button>
			</HoverCardComponent>
		</Provider>
	</VRTestWrapper>
);
