import React from 'react';

import { cssMap } from '@atlaskit/css';
import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { Card } from '../../src';
import VRTestWrapper from '../utils/vr-test-wrapper';

import { installInteractionSessionFake } from './shared/interaction-session-fake';
import { firstPartyResponse, SHARED_FIRST_PARTY_URL } from './shared/mocks';

installInteractionSessionFake();

/**
 * Positive case — first-party inline link with `showHoverPreview`.
 *
 * The trigger is rendered as a direct child of a padded `<Box>`, mirroring
 * the `HoverCardViewSection` pattern in `14-hover-card-views.tsx`. The
 * vertical padding around the trigger eliminates the diagonal-traversal
 * "dead zone" between the trigger and the popover; without it the popup
 * closes before the cursor can land on it in a standalone example bundle.
 *
 * Hover the link, wait ~500ms for the popover, then slide the cursor up
 * onto it. The popover's title anchor should have `href` ending in
 * `?xpis=…` when the gates are enabled.
 *
 * Toggle gates in the examples site's feature-flag panel (or via URL params).
 */
const styles = cssMap({
	triggerWrapper: {
		paddingTop: token('space.200'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.0'),
	},
});

class FirstPartyClient extends Client {
	fetchData() {
		return Promise.resolve(firstPartyResponse);
	}
}

export default (): React.JSX.Element => (
	<VRTestWrapper>
		<Provider client={new FirstPartyClient('staging')} product="CONFLUENCE">
			<Box xcss={styles.triggerWrapper}>
				<Card url={SHARED_FIRST_PARTY_URL} appearance="inline" showHoverPreview={true} />
			</Box>
		</Provider>
	</VRTestWrapper>
);
