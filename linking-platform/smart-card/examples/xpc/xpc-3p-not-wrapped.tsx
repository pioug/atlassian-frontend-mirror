import React from 'react';

import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';

import { Card } from '../../src';
import VRTestWrapper from '../utils/vr-test-wrapper';

import { installInteractionSessionFake } from './shared/interaction-session-fake';
import { SHARED_THIRD_PARTY_URL, thirdPartyResponse } from './shared/mocks';

installInteractionSessionFake();

/**
 * Negative case — third-party Smart Link (`meta.is1PLink === false`).
 *
 * Even with both feature gates ON, the rendered anchor `href` should remain
 * `https://example.com/some/external/page` unchanged — we never decorate
 * third-party destinations with internal cross-product analytics params.
 *
 * Toggle gates in the examples site's feature-flag panel (or via URL params).
 */
class ThirdPartyClient extends Client {
	fetchData() {
		return Promise.resolve(thirdPartyResponse);
	}
}

export default (): React.JSX.Element => (
	<VRTestWrapper>
		<Provider client={new ThirdPartyClient('staging')}>
			<p>
				Inline: <Card url={SHARED_THIRD_PARTY_URL} appearance="inline" showHoverPreview={false} />
			</p>
			<Card url={SHARED_THIRD_PARTY_URL} appearance="block" />
		</Provider>
	</VRTestWrapper>
);
