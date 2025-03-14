import React from 'react';

import type CardView from '../utils/card-view';
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
	NotFoundClient,
	NotFoundWithNoIconClient,
	NotFoundWithSiteAccessExistsClient,
	ResolvedClient,
	ResolvingClient,
	UnAuthClient,
	UnAuthClientWithNoAuthFlow,
	UnAuthClientWithNoIcon,
} from '../utils/custom-client';

import CardViewSection from './card-view-section';

const CardViewExample = ({
	url,
	...props
}: Omit<React.ComponentProps<typeof CardView>, 'client'> & {
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

export default CardViewExample;
