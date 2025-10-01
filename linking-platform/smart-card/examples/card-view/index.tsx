import React from 'react';

import {
	ErroredClient,
	ForbiddenClient,
	ForbiddenClientWithNoIcon,
	ForbiddenWithObjectRequestAccessClient,
	ForbiddenWithSiteDeniedRequestClient,
	ForbiddenWithSiteDirectAccessClient,
	ForbiddenWithSiteForbiddenClient,
	ForbiddenWithSitePendingRequestClient,
	ForbiddenWithSiteRequestAccessClient,
	mocks,
	NotFoundClient,
	NotFoundWithNoIconClient,
	NotFoundWithSiteAccessExistsClient,
	ResolvedClient,
	ResolvedClientWithDelay,
	ResolvingClient,
	UnAuthClient,
	UnAuthClientWithNoAuthFlow,
	UnAuthClientWithNoIcon,
} from '@atlaskit/link-test-helpers';
import { type Card, ElementName, SmartLinkSize, TitleBlock } from '@atlaskit/smart-card';
import { CardSSR } from '@atlaskit/smart-card/ssr';

import type CardView from '../utils/card-view';

import CardViewSection from './card-view-section';

const CardViewExample = ({
	url,
	...props
}: Omit<React.ComponentProps<typeof CardView>, 'client'> & {
	CardComponent?: typeof Card | typeof CardSSR;
	fontSize?: React.CSSProperties['fontSize'];
}) => (
	<React.Fragment>
		<CardViewSection {...props} client={new ResolvingClient()} title="[Resolving]" />
		<CardViewSection {...props} client={new ResolvedClient()} title="[Resolved]" url={url} />
		<CardViewSection {...props} client={new ForbiddenClient()} title="[Forbidden] Default" />
		<CardViewSection
			{...props}
			client={new ForbiddenWithSiteRequestAccessClient()}
			description="I don't have access to the site, but I can request access"
			title="[Forbidden] Site - Request Access"
		/>
		<CardViewSection
			{...props}
			client={new ForbiddenWithSitePendingRequestClient()}
			description="I don't have access to the site, but I've already requested access and I'm waiting"
			title="[Forbidden] Site - Pending Request"
		/>
		<CardViewSection
			{...props}
			client={new ForbiddenWithSiteDeniedRequestClient()}
			description="I don't have access to the site, and my previous request was denied"
			title="[Forbidden] Site - Denied Request"
		/>
		<CardViewSection
			{...props}
			client={new ForbiddenWithSiteDirectAccessClient()}
			description="I don't have access to the site, but I can join directly"
			title="[Forbidden] Site - Direct Access"
		/>
		<CardViewSection
			{...props}
			client={new ForbiddenWithObjectRequestAccessClient()}
			description="I have access to the site, but not the object"
			title="[Forbidden] Object - Request Access"
		/>
		<CardViewSection
			{...props}
			client={new ForbiddenWithSiteForbiddenClient()}
			description="When you don't have access to the site, and you can't request access"
			title="[Forbidden] Forbidden"
		/>
		<CardViewSection
			{...props}
			client={new ForbiddenClientWithNoIcon()}
			title="[Forbidden] Default Icon"
		/>
		<CardViewSection {...props} client={new NotFoundClient()} title="[Not Found] Default" />
		<CardViewSection
			{...props}
			client={new NotFoundWithSiteAccessExistsClient()}
			description="I have access to the site, but not the object or object is not-found"
			title="[Not Found] Access Exists"
		/>
		<CardViewSection
			{...props}
			client={new NotFoundWithNoIconClient()}
			title="[Not Found] Default Icon"
		/>
		<CardViewSection {...props} client={new UnAuthClient()} title="[Unauthorized]" />
		<CardViewSection
			{...props}
			client={new UnAuthClientWithNoAuthFlow()}
			title="[Unauthorized] No auth flow"
		/>
		<CardViewSection
			{...props}
			client={new UnAuthClientWithNoIcon()}
			title="[Unauthorized] Default Icon"
		/>
		<CardViewSection {...props} client={new ErroredClient()} title="[Error]" />
	</React.Fragment>
);

export const FlexibleCardViewExample = ({
	url,
	...props
}: Omit<React.ComponentProps<typeof CardView>, 'client'> & {
	CardComponent?: typeof Card | typeof CardSSR;
	fontSize?: React.CSSProperties['fontSize'];
}) => (
	<React.Fragment>
		<p>
			<em>
				Examples below showcase the <code>`placeholderData`</code> prop - only available to smart
				cards using flexible UI.
			</em>
			<br />
			Requires the <code>`platform_initial_data_for_smart_cards`</code> feature flag to be enabled.
		</p>
		<CardViewSection
			{...props}
			client={new ResolvingClient()}
			title="[Resolving] with placeholder data"
			description='This will always be "resolving" but it should display data as `placeholderData` prop is provided'
			// ANIP-288: placeholderData is not part of the public API for CardProps YET
			{...{ placeholderData: mocks.simpleProjectPlaceholderData }}
			ui={{ removeBlockRestriction: true, size: SmartLinkSize.Medium }}
			CardComponent={CardSSR}
		>
			<TitleBlock
				hideTitleTooltip
				maxLines={1}
				metadata={[
					{
						name: ElementName.State,
					},
				]}
			/>
		</CardViewSection>
		<CardViewSection
			{...props}
			client={new ResolvedClientWithDelay()}
			title="[ResolveWithDelay] with placeholder data"
			description='This will display `placeholderData` but will switch to "resolved" data after an initial delay'
			// ANIP-288: placeholderData is not part of the public API for CardProps YET
			{...{ placeholderData: mocks.simpleProjectPlaceholderData }}
			ui={{ removeBlockRestriction: true, size: SmartLinkSize.Medium }}
			CardComponent={CardSSR}
		>
			<TitleBlock
				hideTitleTooltip
				maxLines={1}
				metadata={[
					{
						name: ElementName.State,
					},
				]}
			/>
		</CardViewSection>
	</React.Fragment>
);

export default CardViewExample;
