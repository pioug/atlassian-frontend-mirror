import React from 'react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	type CardProviderStoreOpts,
	CardClient as Client,
	SmartCardProvider as Provider,
} from '@atlaskit/link-provider';

import { Card } from '../../src';
import {
	mockConfluenceResponse,
	mockSSRResponse,
} from '../../src/view/HoverCard/__tests__/__mocks__/mocks';
import VRTestWrapper from '../utils/vr-test-wrapper';

class CustomLoadingClient extends Client {
	async fetchData(url: string) {
		await new Promise(() => {});
		return Promise.resolve(mockConfluenceResponse as JsonLd.Response);
	}
}

const url = 'https://www.mockurl.com';

const mockState: any = {
	status: 'resolved',
	lastUpdatedAt: 1624877833614,
	details: mockSSRResponse,
};

const storeOptions: CardProviderStoreOpts = {
	initialState: {
		[url]: mockState,
	},
};

export default () => (
	<VRTestWrapper>
		<Provider storeOptions={storeOptions} client={new CustomLoadingClient('staging')}>
			<Card url={url} appearance="inline" showHoverPreview={true} testId="ssr-hover-card-loading" />
		</Provider>
	</VRTestWrapper>
);
