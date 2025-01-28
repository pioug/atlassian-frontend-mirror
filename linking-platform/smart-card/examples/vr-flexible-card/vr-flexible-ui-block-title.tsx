/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import type { CardType } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';

import { type ActionItem } from '../../src';
import { ElementName, SmartLinkPosition, SmartLinkSize, SmartLinkTheme } from '../../src/constants';
import FlexibleCard from '../../src/view/FlexibleCard';
import { TitleBlock } from '../../src/view/FlexibleCard/components/blocks';
import { type TitleBlockProps } from '../../src/view/FlexibleCard/components/blocks/title-block/types';
import {
	getCardState,
	makeCustomActionItem,
	makeDeleteActionItem,
	makeEditActionItem,
} from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

import Old from './vr-flexible-ui-block-titleOld';

const gridStyles = css({
	display: 'grid',
	gridTemplateColumns: 'repeat(2, 1fr)',
});

const renderResolvedView = ({
	actions,
	maxLines,
	position,
	className,
	showActionOnHover,
	size,
	testId,
	text,
	theme,
}: TitleBlockProps) => {
	const cardState = getCardState({
		data: {
			'@type': 'atlassian:Project',
			'atlassian:state': 'open',
			attributedTo: [
				{ '@type': 'Person', name: 'Atlassian A' },
				{ '@type': 'Person', name: 'Atlassian B' },
				{ '@type': 'Person', name: 'Atlassian C' },
			],
		},
	});
	return (
		<FlexibleCard cardState={cardState} ui={{ size, theme }} url="link-url">
			<TitleBlock
				testId={testId}
				maxLines={maxLines}
				position={position}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={className}
				metadata={[
					{ name: ElementName.State },
					{ name: ElementName.AuthorGroup },
					{ name: ElementName.CollaboratorGroup },
				]}
				subtitle={[
					{ name: ElementName.CommentCount },
					{ name: ElementName.ViewCount },
					{ name: ElementName.ReactCount },
					{ name: ElementName.VoteCount },
				]}
				actions={actions}
				text={text}
				showActionOnHover={showActionOnHover}
			/>
		</FlexibleCard>
	);
};

const renderErroredView = (
	status: CardType,
	meta = {},
	actions: ActionItem[] = [],
	hideRetry: boolean = false,
	size: SmartLinkSize = SmartLinkSize.Medium,
	data = {},
) => {
	const cardState = getCardState({ data, meta, status });
	return (
		<FlexibleCard
			cardState={cardState}
			url={`https://${status}-url?s=something%20went%20wrong`}
			onAuthorize={() => {}}
		>
			<TitleBlock
				actions={actions}
				position={SmartLinkPosition.Center}
				hideRetry={hideRetry}
				size={size}
			/>
		</FlexibleCard>
	);
};

export default () => {
	if (!fg('bandicoots-compiled-migration-smartcard')) {
		return <Old />;
	}
	return (
		<VRTestWrapper>
			<SmartCardProvider>
				<h5>Default</h5>
				<FlexibleCard cardState={getCardState()} url="link-url">
					<TitleBlock />
				</FlexibleCard>

				{Object.values(SmartLinkSize).map((size, idx) => (
					<React.Fragment key={idx}>
						<h5>Size: {size}</h5>
						{renderResolvedView({ size })}
					</React.Fragment>
				))}
				<h5>With default action items:</h5>
				{renderResolvedView({ actions: [makeDeleteActionItem()] })}
				<h5>With content only action items:</h5>
				{renderResolvedView({
					actions: [makeDeleteActionItem({ hideIcon: true })],
				})}
				<h5>With icon only action items:</h5>
				{renderResolvedView({
					actions: [makeDeleteActionItem({ hideContent: true })],
				})}
				<h5>With custom action:</h5>
				{renderResolvedView({ actions: [makeCustomActionItem()] })}
				<h5>With on hover only actions:</h5>
				{renderResolvedView({
					showActionOnHover: true,
					actions: [makeCustomActionItem(), makeDeleteActionItem()],
					testId: 'actions-on-hover-title-block',
				})}
				<h5>Theme: {SmartLinkTheme.Black}</h5>
				{renderResolvedView({ theme: SmartLinkTheme.Black })}
				<h5>Max lines: 1</h5>
				{renderResolvedView({
					maxLines: 1,
					size: SmartLinkSize.Medium,
					theme: SmartLinkTheme.Link,
				})}
				<h5>Position: {SmartLinkPosition.Center}</h5>
				{renderResolvedView({
					position: SmartLinkPosition.Center,
				})}
				<h5>Title override </h5>
				{renderResolvedView({ text: 'Test Title' })}
				<div css={gridStyles}>
					<div>
						{renderResolvedView({
							maxLines: 1,
							text: 'https://product-fabric.atlassian.net/browse/EDM-3050',
						})}
					</div>
					<div>
						{renderResolvedView({
							maxLines: 1,
							text: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBgRXhpZgAASUkqAAgAAAACADEBAgAHAAAAJgAAAGmHBAABAAAALgAAAAAAAABHb29nbGUAAAMAAJAHAAQAAAAwM==',
						})}
					</div>
				</div>
				<h4>Views</h4>
				<h5>Errored view</h5>
				{renderErroredView('errored', {}, [makeEditActionItem({ hideIcon: true })])}
				{renderErroredView('errored', {}, [], true, SmartLinkSize.Small)}
				<h5>Forbidden view</h5>
				{renderErroredView(
					'forbidden',
					{
						visibility: 'restricted',
						access: 'forbidden',
						auth: [
							{
								key: 'some-flow',
								displayName: 'Flow',
								url: 'https://outbound-auth/flow',
							},
						],
					},
					[makeEditActionItem({ hideContent: true }), makeDeleteActionItem({ hideContent: true })],
				)}
				{renderErroredView(
					'forbidden',
					{
						visibility: 'restricted',
						access: 'forbidden',
						auth: [
							{
								key: 'some-flow',
								displayName: 'Flow',
								url: 'https://outbound-auth/flow',
							},
						],
					},
					[],
					true,
					SmartLinkSize.Small,
				)}
				<h5>Not found view</h5>
				{renderErroredView(
					'not_found',
					{
						visibility: 'not_found',
						access: 'forbidden',
					},
					[makeDeleteActionItem()],
				)}
				{renderErroredView(
					'not_found',
					{
						visibility: 'not_found',
						access: 'forbidden',
					},
					[],
					true,
					SmartLinkSize.Small,
				)}
				<h5>Unauthorized view</h5>
				{renderErroredView(
					'unauthorized',
					{
						visibility: 'restricted',
						access: 'unauthorized',
						auth: [
							{
								key: 'some-flow',
								displayName: 'Flow',
								url: 'https://outbound-auth/flow',
							},
						],
					},
					[],
					undefined,
					undefined,
					{
						generator: {
							'@type': 'Object',
							name: 'Google',
							icon: {
								'@type': 'Image',
								url: 'http://www.google.com/favicon.ico',
							},
						},
					},
				)}
				{renderErroredView(
					'unauthorized',
					{
						visibility: 'restricted',
						access: 'unauthorized',
						auth: [
							{
								key: 'some-flow',
								displayName: 'Flow',
								url: 'https://outbound-auth/flow',
							},
						],
					},
					[makeEditActionItem(), makeDeleteActionItem()],
					true,
					SmartLinkSize.Small,
				)}
				<h5>Resolving view</h5>
				<FlexibleCard cardState={{ status: 'resolving' }} url="https://resolving-url?s=loading">
					<TitleBlock
						actions={[makeEditActionItem({ hideContent: true })]}
						position={SmartLinkPosition.Center}
					/>
				</FlexibleCard>
			</SmartCardProvider>
		</VRTestWrapper>
	);
};
