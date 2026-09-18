import React from 'react';

import Client from '@atlaskit/link-provider/client';
import { SmartCardProvider as Provider } from '@atlaskit/link-provider/smart-card-provider';

import { Card } from '../../src';
import VRTestWrapper from '../utils/vr-test-wrapper';
import { installInteractionSessionFake } from './shared/interaction-session-fake';
import { firstPartyResponse, SHARED_FIRST_PARTY_URL } from './shared/mocks';

installInteractionSessionFake();

/**
 * Positive case — first-party inline Smart Link.
 *
 * With `atlaskit-analytics-cross-product`
 * gates ON, the inline card's anchor
 * `href` should contain `?xpis=…`. Left-, middle-, and Ctrl+click should all
 * navigate to the wrapped URL.
 *
 * Toggle gates in the examples site's feature-flag panel (or via URL params).
 */
class FirstPartyClient extends Client {
	fetchData() {
		return Promise.resolve(firstPartyResponse);
	}
}

export default (): React.JSX.Element => (
	<VRTestWrapper>
		<Provider client={new FirstPartyClient('staging')} product="CONFLUENCE">
			<Card url={SHARED_FIRST_PARTY_URL} appearance="inline" showHoverPreview={false} />
		</Provider>
	</VRTestWrapper>
);
