/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Provider, Client, type ResolveResponse } from '../../src';
import { Card } from '../../src';
import {
	mockSSRResponse,
	mockConfluenceResponse,
} from '../../src/view/HoverCard/__tests__/__mocks__/mocks';
import { type CardProviderStoreOpts } from '@atlaskit/link-provider';
import VRTestWrapper from '../utils/vr-test-wrapper';

class CustomLoadingClient extends Client {
	async fetchData(url: string) {
		await new Promise(() => {});
		return Promise.resolve(mockConfluenceResponse as ResolveResponse);
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
