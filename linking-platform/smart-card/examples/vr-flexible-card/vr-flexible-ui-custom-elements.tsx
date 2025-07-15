/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

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
} from '@atlaskit/link-test-helpers';
import { Grid } from '@atlaskit/primitives';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import {
	Card,
	CustomByAccessTypeElement,
	CustomByStatusElement,
	TitleElement,
} from '@atlaskit/smart-card';

import { SmartCardProvider } from '../../src/state';
import VRTestWrapper from '../utils/vr-test-wrapper';

type AccessTypeTextProps = {
	type: string;
};

const AccessTypeText = ({ type }: AccessTypeTextProps): JSX.Element => {
	return (
		<CustomByAccessTypeElement
			REQUEST_ACCESS={{
				id: `${type}-REQUEST_ACCESS`,
				defaultMessage: `${type}-REQUEST_ACCESS`,
				description: 'REQUEST_ACCESS',
			}}
			PENDING_REQUEST_EXISTS={{
				id: `${type}-PENDING_REQUEST_EXISTS`,
				defaultMessage: `${type}-PENDING_REQUEST_EXISTS`,
				description: 'PENDING_REQUEST_EXISTS',
			}}
			FORBIDDEN={{
				id: `${type}-FORBIDDEN`,
				defaultMessage: `${type}-FORBIDDEN`,
				description: 'FORBIDDEN',
			}}
			DENIED_REQUEST_EXISTS={{
				id: `${type}-DENIED_REQUEST_EXISTS`,
				defaultMessage: `${type}-DENIED_REQUEST_EXISTS`,
				description: 'DENIED_REQUEST_EXISTS',
			}}
			DIRECT_ACCESS={{
				id: `${type}-DIRECT_ACCESS`,
				defaultMessage: `${type}-DIRECT_ACCESS`,
				description: 'DIRECT_ACCESS',
			}}
			fallback={{
				id: `${type}-FALLBACK`,
				defaultMessage: `${type}-FALLBACK`,
				description: 'FALLBACK',
			}}
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
											forbidden={<AccessTypeText type="FORBIDDEN" />}
											not_found={<AccessTypeText type="NOT_FOUND" />}
											unauthorized={<AccessTypeText type="UNAUTHORIZED" />}
											errored={<AccessTypeText type="ERRORED" />}
											pending={<AccessTypeText type="PENDING" />}
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
