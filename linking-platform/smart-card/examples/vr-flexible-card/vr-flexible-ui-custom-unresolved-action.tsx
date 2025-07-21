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
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Grid } from '@atlaskit/primitives';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import { Card, TitleElement } from '@atlaskit/smart-card';

import { SmartCardProvider } from '../../src/state';
import CustomUnresolvedAction, {
	type CustomStatusComponents,
} from '../../src/view/FlexibleCard/components/actions/custom-unresolved-action';
import ExampleContainer from '../utils/example-container';
import VRTestWrapper from '../utils/vr-test-wrapper';

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

const forbiddenMessageDescriptors = {
	REQUEST_ACCESS: {
		id: 'REQUEST_ACCESS',
		defaultMessage: 'Request Access',
	},
	ACCESS_EXISTS: {
		id: 'ACCESS_EXISTS',
		defaultMessage: 'Try another account',
	},
	DIRECT_ACCESS: {
		id: 'DIRECT_ACCESS',
		defaultMessage: 'Join Product',
	},
	FALLBACK: {
		id: 'FALLBACK',
		defaultMessage: 'Try another account',
	},
	PENDING_REQUEST_EXISTS: {
		id: 'PENDING_REQUEST_EXISTS',
		defaultMessage: 'Request pending',
	},
	FORBIDDEN: {
		id: 'FORBIDDEN',
		defaultMessage: 'Access forbidden',
	},
	DENIED_REQUEST_EXISTS: {
		id: 'DENIED_REQUEST_EXISTS',
		defaultMessage: 'Request denied',
	},
} satisfies CustomStatusComponents;

const unauthorizedMessageDescriptors = {
	FALLBACK: {
		id: 'FALLBACK',
		defaultMessage: 'Connect account',
	},
	DENIED_REQUEST_EXISTS: {
		id: 'DENIED_REQUEST_EXISTS',
		defaultMessage: 'Request denied',
	},
	REQUEST_ACCESS: {
		id: 'REQUEST_ACCESS',
		defaultMessage: 'Request Access',
	},
	ACCESS_EXISTS: {
		id: 'ACCESS_EXISTS',
		defaultMessage: 'Try another account',
	},
	DIRECT_ACCESS: {
		id: 'DIRECT_ACCESS',
		defaultMessage: 'Join Product',
	},
	PENDING_REQUEST_EXISTS: {
		id: 'PENDING_REQUEST_EXISTS',
		defaultMessage: 'Request pending',
	},
	FORBIDDEN: {
		id: 'FORBIDDEN',
		defaultMessage: 'Access forbidden',
	},
} satisfies CustomStatusComponents;

const Component = ({ onlyShowIfAction }: { onlyShowIfAction: boolean }): JSX.Element => {
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
										<CustomUnresolvedAction
											onlyShowIfAction={onlyShowIfAction}
											forbidden={forbiddenMessageDescriptors}
											unauthorized={unauthorizedMessageDescriptors}
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

export const FlexibleUiCustomUnresolvedActionOnlyShowIfAction = (): JSX.Element => {
	return (
		<ExampleContainer title="Custom Unresolved Action Example Only Show If Action">
			<Component onlyShowIfAction={true} />
		</ExampleContainer>
	);
};

export const FlexibleUiCustomUnresolvedAction = (): JSX.Element => {
	return (
		<ExampleContainer title="Custom Unresolved Action Example">
			<Component onlyShowIfAction={false} />
		</ExampleContainer>
	);
};
