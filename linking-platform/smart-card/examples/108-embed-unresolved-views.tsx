/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ProviderProps } from '@atlaskit/link-provider';
import { css, jsx } from '@compiled/react';
import React from 'react';
import CardView from './utils/card-view';
import {
	ForbiddenClient,
	ForbiddenWithObjectRequestAccessClient,
	ForbiddenWithSiteDeniedRequestClient,
	ForbiddenWithSiteDirectAccessClient,
	ForbiddenWithSiteForbiddenClient,
	ForbiddenWithSitePendingRequestClient,
	ForbiddenWithSiteRequestAccessClient,
	NotFoundClient,
	NotFoundWithSiteAccessExistsClient,
	UnAuthClient,
	UnAuthClientWithNoAuthFlow,
	UnAuthClientWithProviderImage,
} from './utils/custom-client';
import { token } from '@atlaskit/tokens';

const render = (client: ProviderProps['client'], title: string, description?: string) => (
	<React.Fragment>
		<h4>{title}</h4>
		{description ? (
			<p>
				<b>Context:</b> {description}
			</p>
		) : undefined}
		<CardView appearance="embed" client={client} url="https://site.atlassian.net/browse/key-1" />
	</React.Fragment>
);

const renderWithCustomWidth = (
	client: ProviderProps['client'],
	title: string,
	description: string,
	width: string,
	height: string,
) => (
	<React.Fragment>
		<h4>{title}</h4>
		{description ? (
			<p>
				<b>Context:</b> {description}
			</p>
		) : undefined}

		<div style={{ width, height }}>
			<CardView
				appearance="embed"
				client={client}
				url="https://site.atlassian.net/browse/key-1"
				/** Forces the embed to shrink when in a container smaller than it's content. Needed to test overflow behaviour. */
				inheritDimensions={true}
			/>
		</div>
	</React.Fragment>
);

const embedWrapperStyles = css({
	width: '640px',
	margin: `${token('space.150', '12px')} auto`,
});

// Cross-Join: https://product-fabric.atlassian.net/wiki/spaces/EM/pages/3726016731
export default () => {
	return (
		<div css={embedWrapperStyles}>
			{renderWithCustomWidth(
				new UnAuthClientWithProviderImage(),
				'[Unauthorized] Custom height/width with provider image',
				'For testing overflow behaviour',
				'300px',
				'100px',
			)}
			{render(new ForbiddenClient(), '[Forbidden] Default')}
			{render(
				new ForbiddenWithSiteRequestAccessClient(),
				'[Forbidden] Site - Request Access',
				"I don't have access to the site, but I can request access",
			)}
			{render(
				new ForbiddenWithSitePendingRequestClient(),
				'[Forbidden] Site - Pending Request',
				"I don't have access to the site, but I’ve already requested access and I’m waiting",
			)}
			{render(
				new ForbiddenWithSiteDeniedRequestClient(),
				'[Forbidden] Site - Denied Request',
				"I don't have access to the site, and my previous request was denied",
			)}
			{render(
				new ForbiddenWithSiteDirectAccessClient(),
				'[Forbidden] Site - Direct Access',
				"I don't have access to the site, but I can join directly",
			)}
			{render(
				new ForbiddenWithObjectRequestAccessClient(),
				'[Forbidden] Object - Request Access',
				'I have access to the site, but not the object',
			)}
			{render(
				new ForbiddenWithSiteForbiddenClient(),
				'[Forbidden] Forbidden',
				"When you don't have access to the site, and you can’t request access",
			)}
			{render(new NotFoundClient(), '[Not Found] Default')}
			{render(
				new NotFoundWithSiteAccessExistsClient(),
				'[Not Found] Access Exists',
				'I have access to the site, but not the object or object is not-found',
			)}
			{render(new UnAuthClient(), '[Unauthorized] Default')}
			{render(new UnAuthClientWithNoAuthFlow(), '[Unauthorized] No auth flow')}
			{render(new UnAuthClientWithProviderImage(), '[Unauthorized] With provider image')}
		</div>
	);
};
