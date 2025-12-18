import React, { useCallback, useMemo, useState } from 'react';

import { cssMap } from '@atlaskit/css';
import { type ProviderProps, SmartCardProvider } from '@atlaskit/link-provider';
import {
	ErroredClient,
	ForbiddenClient,
	ForbiddenWithObjectRequestAccessClient,
	ForbiddenWithSiteDeniedRequestClient,
	ForbiddenWithSiteDirectAccessClient,
	ForbiddenWithSiteForbiddenClient,
	ForbiddenWithSitePendingRequestClient,
	ForbiddenWithSiteRequestAccessClient,
	NotFoundClient,
	NotFoundWithSiteAccessExistsClient,
	ResolvedClient,
	ResolvingClient,
	UnAuthClient,
	UnAuthClientWithNoAuthFlow,
} from '@atlaskit/link-test-helpers';
import Lozenge from '@atlaskit/lozenge';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import { RadioGroup } from '@atlaskit/radio';
import { type OptionsPropType } from '@atlaskit/radio/types';
import { token } from '@atlaskit/tokens';

import { Card, TitleBlock } from '../src';
import { HoverCard } from '../src/hoverCard';

import ExampleContainer from './utils/example-container';
import HoverCardBox from './utils/hover-card-box';

const styles = cssMap({
	triggerWrapper: {
		paddingTop: token('space.200'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.0'),
	},
});

const HoverCardViewSection = ({
	description,
	expected = false,
	title,
	trigger,
	client,
}: {
	description?: string;
	expected?: boolean;
	title: string;
	trigger: React.ReactNode;
} & Pick<ProviderProps, 'client'>) => (
	<React.Fragment>
		{title !== '' ? (
			<h6>
				{title}{' '}
				<Lozenge appearance={expected ? 'success' : 'removed'} isBold={true}>
					{expected ? 'Yes' : 'No'}
				</Lozenge>
			</h6>
		) : undefined}

		{description !== undefined && description !== '' ? <p>Context: {description}</p> : undefined}
		<SmartCardProvider client={client}>
			<Box xcss={styles.triggerWrapper}>{trigger}</Box>
		</SmartCardProvider>
	</React.Fragment>
);

const options: OptionsPropType = [
	{ name: 'type', value: 'standalone', label: 'Standalone HoverCard' },
	{ name: 'type', value: 'inline', label: 'InlineCard with showHoverPreview' },
	{ name: 'type', value: 'flexible', label: 'FlexibleCard with showHoverPreview' },
];

export default () => {
	const [type, setType] = useState('standalone');

	const trigger = useMemo(() => {
		const url = 'https://some.url';

		switch (type) {
			case 'inline':
				return <Card appearance="inline" url={url} showHoverPreview={true} />;
			case 'flexible':
				return (
					<Card appearance="inline" url={url} showHoverPreview={true}>
						<TitleBlock />
					</Card>
				);
			case 'standalone':
			default:
				return (
					<HoverCard url={url}>
						<HoverCardBox />
					</HoverCard>
				);
		}
	}, [type]);

	const onTypeChange = useCallback(
		(event: React.SyntheticEvent<HTMLInputElement>) => setType(event.currentTarget.value),
		[],
	);

	return (
		<ExampleContainer title="HoverCard Views">
			<Stack>
				<Box>
					<RadioGroup
						defaultValue="standalone"
						options={options}
						onChange={onTypeChange}
						labelId="hover-card-type"
					/>
				</Box>
				<HoverCardViewSection
					client={new ResolvingClient()}
					expected={type === 'standalone'}
					title="[Resolving]"
					trigger={trigger}
				/>
				<HoverCardViewSection
					client={new ResolvedClient()}
					expected={true}
					title="[Resolved]"
					trigger={trigger}
				/>
				<HoverCardViewSection
					client={new ForbiddenClient()}
					expected={false}
					title="[Forbidden] Default"
					trigger={trigger}
				/>
				<HoverCardViewSection
					client={new ForbiddenWithSiteRequestAccessClient()}
					description="I don't have access to the site, but I can request access"
					expected={true}
					title="[Forbidden] Site - Request Access"
					trigger={trigger}
				/>
				<HoverCardViewSection
					client={new ForbiddenWithSitePendingRequestClient()}
					description="I don't have access to the site, but I've already requested access and I'm waiting"
					expected={true}
					title="[Forbidden] Site - Pending Request"
					trigger={trigger}
				/>
				<HoverCardViewSection
					client={new ForbiddenWithSiteDeniedRequestClient()}
					description="I don't have access to the site, and my previous request was denied"
					expected={true}
					title="[Forbidden] Site - Denied Request"
					trigger={trigger}
				/>
				<HoverCardViewSection
					client={new ForbiddenWithSiteDirectAccessClient()}
					description="I don't have access to the site, but I can join directly"
					expected={true}
					title="[Forbidden] Site - Direct Access"
					trigger={trigger}
				/>
				<HoverCardViewSection
					client={new ForbiddenWithObjectRequestAccessClient()}
					description="I have access to the site, but not the object"
					expected={true}
					title="[Forbidden] Object - Request Access"
					trigger={trigger}
				/>
				<HoverCardViewSection
					client={new ForbiddenWithSiteForbiddenClient()}
					description="When you don't have access to the site, and you can't request access"
					expected={true}
					title="[Forbidden] Forbidden"
					trigger={trigger}
				/>
				<HoverCardViewSection
					client={new NotFoundClient()}
					expected={false}
					title="[Not Found] Default"
					trigger={trigger}
				/>
				<HoverCardViewSection
					client={new NotFoundWithSiteAccessExistsClient()}
					description="I have access to the site, but not the object or object is not-found"
					expected={true}
					title="[Not Found] Access Exists"
					trigger={trigger}
				/>
				<HoverCardViewSection
					client={new UnAuthClientWithNoAuthFlow()}
					expected={false}
					title="[Unauthorized] Default"
					trigger={trigger}
				/>
				<HoverCardViewSection
					client={new UnAuthClient()}
					expected={true}
					title="[Unauthorized] With Auth"
					trigger={trigger}
				/>
				<HoverCardViewSection client={new ErroredClient()} title="[Error]" trigger={trigger} />
			</Stack>
		</ExampleContainer>
	);
};
