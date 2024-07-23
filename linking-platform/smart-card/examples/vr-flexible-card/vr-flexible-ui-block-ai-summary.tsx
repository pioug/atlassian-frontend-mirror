/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { AISummaryBlock } from '../../src/view/FlexibleCard/components/blocks';
import { ElementName, SmartLinkSize } from '../../src/constants';
import {
	blockOverrideCss,
	getCardState,
	makeCustomActionItem,
	makeDeleteActionItem,
	makeDownloadActionItem,
	makePreviewActionItem,
} from '../utils/flexible-ui';
import FlexibleCard from '../../src/view/FlexibleCard';
import { type ActionItem } from '../../src';
import PremiumIcon from '@atlaskit/icon/glyph/premium';
import VRTestWrapper from '../utils/vr-test-wrapper';

const meta = { supportedFeature: ['AISummary'] };

const renderCard = (size?: SmartLinkSize, actions?: ActionItem[]) => {
	const actionData = {
		preview: {
			'@type': 'Link',
			href: 'https://www.youtube.com/embed/tt5VPYoop5Y',
			'atlassian:supportedPlatforms': ['web'],
		},
		'atlassian:downloadUrl':
			'https://www.dropbox.com/s/0ebs1wkexeta5ml/Get%20Started%20with%20Dropbox.pdf?dl=1',
		'schema:potentialAction': [{ '@type': 'DownloadAction', name: 'Download' }],
	};
	const cardState = getCardState({ data: actionData, meta });
	return (
		<FlexibleCard cardState={cardState} ui={{ size }} url="link-url">
			<AISummaryBlock size={size} actions={actions} metadata={[{ name: ElementName.Provider }]} />
		</FlexibleCard>
	);
};

const previewAction = {
	...makePreviewActionItem(),
	appearance: 'primary',
	hideIcon: true,
};

const actions: ActionItem[] = [previewAction];

export default () => (
	<VRTestWrapper>
		<SmartCardProvider isAdminHubAIEnabled={true} product="JSM">
			<h5>Default</h5>
			{renderCard()}
			<h5>With two actions</h5>
			{renderCard(SmartLinkSize.Medium, [previewAction, makeDeleteActionItem()])}
			<h5>With 3+ Custom actions</h5>
			{renderCard(SmartLinkSize.Medium, [
				previewAction,
				makeCustomActionItem(),
				makeCustomActionItem({
					icon: <PremiumIcon label="magic" />,
					testId: 'third-action-item',
					content: 'Magic!',
				}),
				makeDownloadActionItem(),
			])}
			{Object.values(SmartLinkSize).map((size) => (
				<React.Fragment>
					<h5>Size: {size}</h5>
					{renderCard(size, actions)}
				</React.Fragment>
			))}
			<h5>Override CSS</h5>
			<FlexibleCard cardState={getCardState({ meta })} url="link-url">
				<AISummaryBlock overrideCss={blockOverrideCss} />
			</FlexibleCard>
		</SmartCardProvider>
	</VRTestWrapper>
);
