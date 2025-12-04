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

import type { MultiCardViewProps } from '../utils/card-view-props';

import CardViewSection from './card-view-section';

const CardViewExample = ({
	url,
	urls,
	...props
}: MultiCardViewProps & {
	CardComponent?: typeof Card | typeof CardSSR;
	fontSize?: React.CSSProperties['fontSize'];
}): React.JSX.Element => (
	<React.Fragment>
		<CardViewSection {...props} client={new ResolvingClient()} title="[Resolving]" />
		<CardViewSection {...props} client={new ResolvedClient()} title="[Resolved]" urls={urls || (url && [url] || undefined)} />
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
		<CardViewSection 
			{...props}
			 client={new UnAuthClient()} 
			 title="[Unauthorized]" 
			 urls={[
				'https://www.figma.com/slides/vW47To0dYPnT7jlrJdUd7h/Universal-Create-in-TwC?node-id=asdasdasd',
				'https://docs.google.com/document/d/1Bm3FqWFYWIKDtm77nEfo4nYe23qbJl4wT2E0S0BVTwA/edit?usp=sharing',
				'https://atlassian.enterprise.slack.com/archives/C07TNMDEVHC',
				'https://onedrive.live.com/?cid=DB7D70440F201358&id=DB7D70440F201358%21103&parId=root&o=OneUp',
				'https://www.dropbox.com/scl/fi/scebraopvx4bni0sechq9/Atlas23_D1_A_0014.jpg?rlkey=asdasdasd'
			 ]}
		/>
		<CardViewSection
			{...props}
			client={new UnAuthClientWithNoAuthFlow()}
			title="[Unauthorized] No auth flow"
		/>
		<CardViewSection
			{...props}
			url="https://www.some-other-domain.com/different/path/with/id/aslkjdhaskdjhlajsdakjshd?and=query#plus-a-hash"
			client={new UnAuthClientWithNoIcon()}
			title="[Unauthorized] Default Icon"
		/>
		<CardViewSection {...props} client={new ErroredClient()} title="[Error]" />
	</React.Fragment>
);

export const FlexibleCardViewExample = ({
	...props
}: MultiCardViewProps & {
	CardComponent?: typeof Card | typeof CardSSR;
	fontSize?: React.CSSProperties['fontSize'];
}): React.JSX.Element => (
	<React.Fragment>
		<p>
			<em>
				Examples below showcase the <code>`placeholderData`</code> prop - only available to smart
				cards using flexible UI.
			</em>
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
