import { SmartCardProvider } from '@atlaskit/link-provider';
import React from 'react';
import FlexibleCard from '../../src/view/FlexibleCard';
import { ActionBlock } from '../../src/view/FlexibleCard/components/blocks';
import type { ActionBlockProps } from '../../src/view/FlexibleCard/components/blocks/action-block/types';
import { getCardState } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

const renderBlock = (props?: Partial<ActionBlockProps>) => {
	const actionData = {
		preview: {
			'@type': 'Link',
			href: 'https://www.youtube.com/embed/tt5VPYoop5Y',
			'atlassian:supportedPlatforms': ['web'],
		},
		'atlassian:downloadUrl': '/favicon.ico',
		'schema:potentialAction': [{ '@type': 'DownloadAction', name: 'Download' }],
	};
	const cardState = getCardState({ data: actionData });
	return (
		<FlexibleCard cardState={cardState} url="link-url">
			<ActionBlock {...props} />
		</FlexibleCard>
	);
};

export default () => (
	<VRTestWrapper>
		<SmartCardProvider>
			<h5>Default</h5>
			{renderBlock()}
			<h5>Space inline: space.500</h5>
			{renderBlock({ spaceInline: 'space.500' })}
		</SmartCardProvider>
	</VRTestWrapper>
);
