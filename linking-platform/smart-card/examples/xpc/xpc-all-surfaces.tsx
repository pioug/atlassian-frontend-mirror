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
 * One-stop showcase — first-party Smart Link rendered as inline, block,
 * embed, and an inline link with hover preview enabled, all on the same
 * page. Useful for manual smoke-testing every public surface in one refresh.
 *
 * Toggle in the examples site's feature-flag panel:
 *   platform_smartlink_xpc_url_wrapping
 *   atlaskit-analytics-cross-product
 *
 * Expected on each surface:
 *   - inline:     anchor `href` carries `?xpis=…`
 *   - block:      whole-card + title anchors carry `?xpis=…`
 *   - embed:      title anchor carries `?xpis=…`; iframe `src` does not
 *                 (intentional — embed body is not a click-through)
 *   - hover card: popover's title anchor carries `?xpis=…`
 */
const styles = cssMap({
	section: {
		marginBottom: token('space.300'),
	},
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
			<Box xcss={styles.section}>
				<h4>Inline</h4>
				<Card url={SHARED_FIRST_PARTY_URL} appearance="inline" showHoverPreview={false} />
			</Box>
			<Box xcss={styles.section}>
				<h4>Block</h4>
				<Card url={SHARED_FIRST_PARTY_URL} appearance="block" />
			</Box>
			<Box xcss={styles.section}>
				<h4>Embed</h4>
				<Card url={SHARED_FIRST_PARTY_URL} appearance="embed" />
			</Box>
			<Box xcss={styles.section}>
				<h4>Inline with HoverCard (hover the link below to open the preview popover)</h4>
				<Box xcss={styles.triggerWrapper}>
					<Card url={SHARED_FIRST_PARTY_URL} appearance="inline" showHoverPreview={true} />
				</Box>
			</Box>
		</Provider>
	</VRTestWrapper>
);
