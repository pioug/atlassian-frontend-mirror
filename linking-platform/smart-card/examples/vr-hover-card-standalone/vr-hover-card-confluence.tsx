import React from 'react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { ConfluencePage } from '@atlaskit/link-test-helpers';

import { HoverCardComponent } from '../../src/view/HoverCard/components/HoverCardComponent';
import VRTestWrapper from '../utils/vr-test-wrapper';

import '../utils/vr-preload-metadata-icons';

class CustomClient extends Client {
	fetchData(_: string) {
		return Promise.resolve(ConfluencePage as JsonLd.Response);
	}
}

export default (): React.JSX.Element => (
	<VRTestWrapper>
		<Provider client={new CustomClient('staging')}>
			<HoverCardComponent url="https://www.mockurl.com" noFadeDelay={true}>
				<button>Hover over me!</button>
			</HoverCardComponent>
		</Provider>
	</VRTestWrapper>
);
