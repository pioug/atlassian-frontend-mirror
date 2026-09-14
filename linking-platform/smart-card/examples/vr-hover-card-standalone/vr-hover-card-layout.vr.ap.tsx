import React from 'react';

import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import Client from '@atlaskit/link-provider/client';
import { SmartCardProvider as Provider } from '@atlaskit/link-provider/smart-card-provider';

import { mockConfluenceResponse } from '../../src/view/HoverCard/__tests__/__mocks__/mocks';
import { HoverCardComponent } from '../../src/view/HoverCard/components/HoverCardComponent';
import VRTestWrapper from '../utils/vr-test-wrapper';

import '../utils/vr-preload-metadata-icons';

class CustomClient extends Client {
	fetchData(_: string) {
		return Promise.resolve(mockConfluenceResponse as JsonLd.Response);
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
