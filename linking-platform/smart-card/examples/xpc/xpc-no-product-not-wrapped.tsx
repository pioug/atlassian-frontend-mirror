import React from 'react';

import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';

import { Card } from '../../src';
import VRTestWrapper from '../utils/vr-test-wrapper';

import { installInteractionSessionFake } from './shared/interaction-session-fake';
import { firstPartyNoProductResponse, SHARED_FIRST_PARTY_URL } from './shared/mocks';

installInteractionSessionFake();

/**
 * Negative case — first-party link but no `product` prop set on SmartCardProvider.
 *
 * Wrapping should be skipped: `useSmartLinkCrossProductUrlWrapper` reads
 * `product` from the SmartLinkContext (populated by the `product` prop on
 * `<SmartCardProvider>`). Without it, the hook bails rather than emitting a
 * malformed `product=undefined` param into the URL.
 *
 * Toggle gates in the examples site's feature-flag panel (or via URL params).
 */
class NoProductClient extends Client {
	fetchData() {
		return Promise.resolve(firstPartyNoProductResponse);
	}
}

export default (): React.JSX.Element => (
	<VRTestWrapper>
		<Provider client={new NoProductClient('staging')}>
			<Card url={SHARED_FIRST_PARTY_URL} appearance="inline" showHoverPreview={false} />
		</Provider>
	</VRTestWrapper>
);
