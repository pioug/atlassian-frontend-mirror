/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { SnippetBlock } from '../../src';
import { SmartLinkStatus } from '../../src/constants';
import FlexibleCard from '../../src/view/FlexibleCard';
import { getCardState } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

import Old from './vr-flexible-ui-block-snippetOld';

const cardState = getCardState({
	data: {
		summary:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id feugiat elit, ut gravida felis. Phasellus arcu velit, tincidunt id rhoncus sit amet, vehicula vel ligula. Nullam nec vestibulum velit, eu tempus elit. Nunc sodales ultricies metus eget facilisis. Phasellus a arcu tortor. In porttitor metus ac ex ornare, quis efficitur est laoreet. Fusce elit elit, finibus vulputate accumsan ut, porttitor eu libero. Mauris eget hendrerit risus, vitae mollis dui. Sed pretium nisi tellus, quis bibendum est vestibulum ac.',
	},
});

const blockOverrideCss = css({
	backgroundColor: token('color.background.accent.blue.subtle', '#579DFF'),
	padding: token('space.200', '1rem'),
});

export default () => {
	if (!fg('bandicoots-compiled-migration-smartcard')) {
		return <Old />;
	}

	return (
		<VRTestWrapper>
			<SmartCardProvider>
				<h5>Default</h5>
				<FlexibleCard cardState={cardState} url="link-url">
					<SnippetBlock />
				</FlexibleCard>
				<h5>Single line</h5>
				<FlexibleCard cardState={cardState} url="link-url">
					<SnippetBlock maxLines={1} />
				</FlexibleCard>
				<h5>Override CSS</h5>
				<FlexibleCard cardState={cardState} url="link-url">
					<SnippetBlock css={blockOverrideCss} status={cardState.status as SmartLinkStatus} />
				</FlexibleCard>
			</SmartCardProvider>
		</VRTestWrapper>
	);
};
