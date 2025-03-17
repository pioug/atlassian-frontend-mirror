/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import PremiumIcon from '@atlaskit/icon/core/migration/premium';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { token } from '@atlaskit/tokens';

import { type ActionItem } from '../../src';
import { SmartLinkSize, SmartLinkStatus } from '../../src/constants';
import FlexibleCard from '../../src/view/FlexibleCard';
import { FooterBlock } from '../../src/view/FlexibleCard/components/blocks';
import {
	getCardState,
	makeCustomActionItem,
	makeDeleteActionItem,
	makeDownloadActionItem,
	makeEditActionItem,
} from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

const blockOverrideCss = css({
	backgroundColor: token('color.background.accent.blue.subtle', '#579DFF'),
	paddingTop: token('space.200', '1rem'),
	paddingRight: token('space.200', '1rem'),
	paddingBottom: token('space.200', '1rem'),
	paddingLeft: token('space.200', '1rem'),
});

const renderFooter = (size?: SmartLinkSize, actions?: ActionItem[]) => {
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
	const cardState = getCardState({ data: actionData });
	return (
		<FlexibleCard cardState={cardState} ui={{ size }} url="link-url">
			<FooterBlock size={size} actions={actions} />
		</FlexibleCard>
	);
};

const actions: ActionItem[] = [makeDeleteActionItem()];

export default () => {
	return (
		<VRTestWrapper>
			<SmartCardProvider>
				<h5>Default</h5>
				{renderFooter()}
				<h5>With two actions</h5>
				{renderFooter(SmartLinkSize.Medium, [makeDeleteActionItem(), makeEditActionItem()])}
				<h5>With 3+ Custom actions</h5>
				{renderFooter(SmartLinkSize.Medium, [
					makeCustomActionItem(),
					makeDeleteActionItem(),
					makeCustomActionItem({
						icon: <PremiumIcon label="magic" color={token('color.icon', '#44546F')} />,
						testId: 'third-action-item',
						content: 'Magic!',
					}),
					makeDownloadActionItem(),
				])}
				<h5>Hide provider</h5>
				<FlexibleCard cardState={getCardState()} url="link-url">
					<FooterBlock hideProvider={true} />
				</FlexibleCard>
				{Object.values(SmartLinkSize).map((size) => (
					<React.Fragment>
						<h5>Size: {size}</h5>
						{renderFooter(size, actions)}
					</React.Fragment>
				))}
				<h5>Override CSS</h5>
				<FlexibleCard cardState={getCardState()} url="link-url">
					<FooterBlock css={blockOverrideCss} status={getCardState().status as SmartLinkStatus} />
				</FlexibleCard>
			</SmartCardProvider>
		</VRTestWrapper>
	);
};
