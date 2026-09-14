import React from 'react';

import Client from '@atlaskit/link-provider/client';
import { SmartCardProvider as Provider } from '@atlaskit/link-provider/smart-card-provider';

import { Card } from '../../src';
import VRTestWrapper from '../utils/vr-test-wrapper';

import { installInteractionSessionFake } from './shared/interaction-session-fake';
import { firstPartyResponse, SHARED_FIRST_PARTY_URL } from './shared/mocks';

installInteractionSessionFake();

/**
 * Positive case — first-party embed Smart Link.
 *
 * The embed card's title/header anchor should have `href` ending in
 * `?xpis=…`. The `<iframe src>` is INTENTIONALLY left unwrapped: an embed
 * iframe is not a click-through navigation, and the embed URL is a separate
 * concept from the click target.
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
			<Card url={SHARED_FIRST_PARTY_URL} appearance="embed" />
		</Provider>
	</VRTestWrapper>
);
