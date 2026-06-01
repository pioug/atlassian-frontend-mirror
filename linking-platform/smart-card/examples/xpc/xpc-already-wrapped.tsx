import React from 'react';

import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';

import { Card } from '../../src';
import VRTestWrapper from '../utils/vr-test-wrapper';

import { installInteractionSessionFake } from './shared/interaction-session-fake';
import { alreadyWrappedResponse, SHARED_ALREADY_WRAPPED_URL } from './shared/mocks';

installInteractionSessionFake();

/**
 * Negative case — first-party link whose URL already carries `?xpis=`.
 *
 * The wrapper detects the existing param and short-circuits to avoid
 * double-wrapping. The rendered anchor `href` should stay
 * `…JIRA-1?xpis=existing-session` unchanged.
 *
 * Toggle gates in the examples site's feature-flag panel (or via URL params).
 */
class AlreadyWrappedClient extends Client {
	fetchData() {
		return Promise.resolve(alreadyWrappedResponse);
	}
}

export default (): React.JSX.Element => (
	<VRTestWrapper>
		<Provider client={new AlreadyWrappedClient('staging')} product="CONFLUENCE">
			<Card url={SHARED_ALREADY_WRAPPED_URL} appearance="inline" showHoverPreview={false} />
		</Provider>
	</VRTestWrapper>
);
