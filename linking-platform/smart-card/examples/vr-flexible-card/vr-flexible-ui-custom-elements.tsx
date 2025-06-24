/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { Grid } from '@atlaskit/primitives';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import {
	Card,
	CustomByAccessTypeElement,
	CustomByStatusElement,
	TitleElement,
} from '@atlaskit/smart-card';

import { SmartCardProvider } from '../../src/state';
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
	UnAuthClientWithProviderImage,
	UnicornResolvedClient,
} from '../utils/custom-client';
import VRTestWrapper from '../utils/vr-test-wrapper';

type AccessType =
	| 'REQUEST_ACCESS'
	| 'PENDING_REQUEST_EXISTS'
	| 'FORBIDDEN'
	| 'DENIED_REQUEST_EXISTS'
	| 'DIRECT_ACCESS';

const textMessageMap: Record<AccessType, string> = {
	REQUEST_ACCESS: 'REQUEST_ACCESS',
	PENDING_REQUEST_EXISTS: 'PENDING_REQUEST_EXISTS',
	FORBIDDEN: 'FORBIDDEN',
	DENIED_REQUEST_EXISTS: 'DENIED_REQUEST_EXISTS',
	DIRECT_ACCESS: 'DIRECT_ACCESS',
};

const AccessTypeText = (): JSX.Element => {
	return (
		<CustomByAccessTypeElement
			REQUEST_ACCESS={textMessageMap['REQUEST_ACCESS']}
			PENDING_REQUEST_EXISTS={textMessageMap['PENDING_REQUEST_EXISTS']}
			FORBIDDEN={textMessageMap['FORBIDDEN']}
			DENIED_REQUEST_EXISTS={textMessageMap['DENIED_REQUEST_EXISTS']}
			DIRECT_ACCESS={textMessageMap['DIRECT_ACCESS']}
			fallback="FALLBACK"
		/>
	);
};

const clients = [
	{ name: 'Unicorn Client', client: new UnicornResolvedClient() },
	{ name: 'Resolved Client', client: new ResolvedClient() },
	{ name: 'Resolving Client', client: new ResolvingClient() },
	{ name: 'Errored Client', client: new ErroredClient() },
	{ name: 'Forbidden Client', client: new ForbiddenClient() },
	{
		name: 'Forbidden with Object Request Access',
		client: new ForbiddenWithObjectRequestAccessClient(),
	},
	{
		name: 'Forbidden with Site Denied Request',
		client: new ForbiddenWithSiteDeniedRequestClient(),
	},
	{ name: 'Forbidden with Site Direct Access', client: new ForbiddenWithSiteDirectAccessClient() },
	{ name: 'Forbidden with Site Forbidden', client: new ForbiddenWithSiteForbiddenClient() },
	{
		name: 'Forbidden with Site Pending Request',
		client: new ForbiddenWithSitePendingRequestClient(),
	},
	{
		name: 'Forbidden with Site Request Access',
		client: new ForbiddenWithSiteRequestAccessClient(),
	},
	{ name: 'Forbidden Client with No Icon', client: new ForbiddenClientWithNoIcon() },
	{ name: 'Not Found Client', client: new NotFoundClient() },
	{ name: 'Not Found with Site Access Exists', client: new NotFoundWithSiteAccessExistsClient() },
	{ name: 'Not Found with No Icon', client: new NotFoundWithNoIconClient() },
	{ name: 'UnAuth Client', client: new UnAuthClient() },
	{ name: 'UnAuth Client with Provider Image', client: new UnAuthClientWithProviderImage() },
	{ name: 'UnAuth Client with No Auth Flow', client: new UnAuthClientWithNoAuthFlow() },
	{ name: 'UnAuth Client with No Icon', client: new UnAuthClientWithNoIcon() },
];

export default () => {
	return (
		<VRTestWrapper>
			<Grid gap="space.100" templateColumns="1fr 1fr 1fr 1fr">
				{clients.map(({ name, client }, index) => {
					return (
						<Box key={index}>
							<h2>{name}</h2>
							<SmartCardProvider client={client}>
								<Card
									appearance="block"
									url="https://some.url"
									ui={{
										removeBlockRestriction: true,
									}}
								>
									<Stack space="space.100">
										<TitleElement />
										<CustomByStatusElement
											resolved={<span>RESOLVED</span>}
											forbidden={<AccessTypeText />}
											not_found={<AccessTypeText />}
											unauthorized={<AccessTypeText />}
											errored={<AccessTypeText />}
											pending={<AccessTypeText />}
										/>
									</Stack>
								</Card>
							</SmartCardProvider>
						</Box>
					);
				})}
			</Grid>
		</VRTestWrapper>
	);
};
