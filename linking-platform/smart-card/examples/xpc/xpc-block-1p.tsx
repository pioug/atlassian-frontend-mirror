import React from 'react';

import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';

import { Card } from '../../src';
import VRTestWrapper from '../utils/vr-test-wrapper';

import { installInteractionSessionFake } from './shared/interaction-session-fake';
import { firstPartyResponse, SHARED_FIRST_PARTY_URL } from './shared/mocks';

installInteractionSessionFake();

/**
 * Positive case — first-party block Smart Link.
 *
 * Block cards render TWO anchors that should both carry `?xpis=…`:
 *   - the whole-card LayeredLink wrapper
 *   - the inner TitleBlock link
 * Both are derived from `state.details.data.url`, which our `wrappedState`
 * mirror in `CardWithUrl/component.tsx` populates with the wrapped URL.
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
			<Card url={SHARED_FIRST_PARTY_URL} appearance="block" />
		</Provider>
	</VRTestWrapper>
);
