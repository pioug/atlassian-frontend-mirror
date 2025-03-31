import React from 'react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';

import { JiraProject } from '../../examples-helpers/_jsonLDExamples';
import { HoverCardComponent } from '../../src/view/HoverCard/components/HoverCardComponent';
import VRTestWrapper from '../utils/vr-test-wrapper';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(JiraProject as JsonLd.Response);
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
