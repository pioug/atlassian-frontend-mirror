import React from 'react';

import {
	type CardProviderStoreOpts,
	CardClient as Client,
	SmartCardProvider as Provider,
} from '@atlaskit/link-provider';

import { Card } from '../../src';
import { mockSSRResponse } from '../../src/view/HoverCard/__tests__/__mocks__/mocks';
import VRTestWrapper from '../utils/vr-test-wrapper';

class CustomFailureClient extends Client {
	async fetchData(url: string) {
		return Promise.reject('something went wrong');
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

/**
 * Use case: Smart Link is resolved via SSR (represented by the mock initial state)
 * and hover card send a second request to get metadata and that request fails, thus error state.
 * HoverCard still renders 'resolved' status with minimum data from the initial state.
 */
export default () => (
	<VRTestWrapper>
		<Provider storeOptions={storeOptions} client={new CustomFailureClient('staging')}>
			<Card url={url} appearance="inline" showHoverPreview={true} testId="ssr-hover-card-errored" />
		</Provider>
	</VRTestWrapper>
);
