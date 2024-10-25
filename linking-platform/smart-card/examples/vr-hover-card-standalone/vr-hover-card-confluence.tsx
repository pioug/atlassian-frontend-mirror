import React from 'react';

import { ConfluencePage } from '../../examples-helpers/_jsonLDExamples';
import { Client, Provider, type ResolveResponse } from '../../src';
import { HoverCardComponent } from '../../src/view/HoverCard/components/HoverCardComponent';
import VRTestWrapper from '../utils/vr-test-wrapper';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(ConfluencePage as ResolveResponse);
	}
}

export default () => (
	<VRTestWrapper>
		<Provider client={new CustomClient('staging')}>
			<HoverCardComponent url="https://www.mockurl.com" noFadeDelay={true}>
				<button>Hover over me!</button>
			</HoverCardComponent>
		</Provider>
	</VRTestWrapper>
);
