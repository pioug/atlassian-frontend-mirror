import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { SnippetBlock } from '../../src';
import FlexibleCard from '../../src/view/FlexibleCard';
import { blockOverrideCss, getCardState } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

const cardState = getCardState({
	data: {
		summary:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id feugiat elit, ut gravida felis. Phasellus arcu velit, tincidunt id rhoncus sit amet, vehicula vel ligula. Nullam nec vestibulum velit, eu tempus elit. Nunc sodales ultricies metus eget facilisis. Phasellus a arcu tortor. In porttitor metus ac ex ornare, quis efficitur est laoreet. Fusce elit elit, finibus vulputate accumsan ut, porttitor eu libero. Mauris eget hendrerit risus, vitae mollis dui. Sed pretium nisi tellus, quis bibendum est vestibulum ac.',
	},
});

const Old = () => (
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
				<SnippetBlock overrideCss={blockOverrideCss} />
			</FlexibleCard>
		</SmartCardProvider>
	</VRTestWrapper>
);

export default Old;
