import React from 'react';
import { HoverCardComponent } from '../../src/view/HoverCard/components/HoverCardComponent';
import { Provider, type ResolveResponse, Client } from '../../src';
import { mockConfluenceResponse } from '../../src/view/HoverCard/__tests__/__mocks__/mocks';
import VRTestWrapper from '../utils/vr-test-wrapper';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(mockConfluenceResponse as ResolveResponse);
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
