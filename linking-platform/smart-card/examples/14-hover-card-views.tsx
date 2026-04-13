import React, { useCallback, useEffect, useMemo, useState } from 'react';

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
import { useSmartCardActions } from '../src/state/actions';
import { useSmartCardState } from '../src/state/store';
import HoverCardContent from '../src/view/HoverCard/components/HoverCardContent';

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
	rovoOptions,
}: {
	description?: string;
	expected?: boolean;
	rovoOptions?: ProviderProps['rovoOptions'];
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
		<SmartCardProvider client={client} rovoOptions={rovoOptions}>
			<Box xcss={styles.triggerWrapper}>{trigger}</Box>
		</SmartCardProvider>
	</React.Fragment>
);

const DirectHoverCardContent = ({ url }: { url: string }) => {
	const cardState = useSmartCardState(url);
	const { register } = useSmartCardActions('', url);

	useEffect(() => {
		register();
	}, [register]);

	return (
		<HoverCardContent
			cardState={cardState}
			url={url}
			onActionClick={() => {}}
			onResolve={() => {}}
		/>
	);
};

const options: OptionsPropType = [
	{ name: 'type', value: 'standalone', label: 'Standalone HoverCard' },
	{ name: 'type', value: 'inline', label: 'InlineCard with showHoverPreview' },
	{ name: 'type', value: 'flexible', label: 'FlexibleCard with showHoverPreview' },
	{ name: 'type', value: 'content', label: 'Hovercard content' },
];

const LOCAL_STORAGE_KEY = 'smart-card-example-hover-card-view-type';

export default (): React.JSX.Element => {
	const [type, setType] = useState(() => localStorage.getItem(LOCAL_STORAGE_KEY) || 'standalone');

	const content = useMemo(() => {
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
			case 'content':
				return <DirectHoverCardContent url={url} />;
			case 'standalone':
			default:
				return (
					<HoverCard url={url}>
						<HoverCardBox />
					</HoverCard>
				);
		}
	}, [type]);

	const onTypeChange = useCallback((event: React.SyntheticEvent<HTMLInputElement>) => {
		const value = event.currentTarget.value;
		localStorage.setItem(LOCAL_STORAGE_KEY, value);
		setType(value);
	}, []);

	return (
		<ExampleContainer title="HoverCard Views">
			<Stack>
				<Box>
					<RadioGroup
						defaultValue={type}
						options={options}
						onChange={onTypeChange}
						labelId="hover-card-type"
					/>
				</Box>
				<HoverCardViewSection
					client={new ResolvingClient()}
					expected={type === 'standalone'}
					title="[Resolving]"
					trigger={content}
				/>
				<HoverCardViewSection
					client={new ResolvedClient()}
					expected={true}
					title="[Resolved]"
					trigger={content}
				/>
				<HoverCardViewSection
					client={new ForbiddenClient()}
					expected={false}
					title="[Forbidden] Default"
					trigger={content}
				/>
				<HoverCardViewSection
					client={new ForbiddenWithSiteRequestAccessClient()}
					description="I don't have access to the site, but I can request access"
					expected={true}
					title="[Forbidden] Site - Request Access"
					trigger={content}
				/>
				<HoverCardViewSection
					client={new ForbiddenWithSitePendingRequestClient()}
					description="I don't have access to the site, but I've already requested access and I'm waiting"
					expected={true}
					title="[Forbidden] Site - Pending Request"
					trigger={content}
				/>
				<HoverCardViewSection
					client={new ForbiddenWithSiteDeniedRequestClient()}
					description="I don't have access to the site, and my previous request was denied"
					expected={true}
					title="[Forbidden] Site - Denied Request"
					trigger={content}
				/>
				<HoverCardViewSection
					client={new ForbiddenWithSiteDirectAccessClient()}
					description="I don't have access to the site, but I can join directly"
					expected={true}
					title="[Forbidden] Site - Direct Access"
					trigger={content}
				/>
				<HoverCardViewSection
					client={new ForbiddenWithObjectRequestAccessClient()}
					description="I have access to the site, but not the object"
					expected={true}
					title="[Forbidden] Object - Request Access"
					trigger={content}
				/>
				<HoverCardViewSection
					client={new ForbiddenWithSiteForbiddenClient()}
					description="When you don't have access to the site, and you can't request access"
					expected={true}
					title="[Forbidden] Forbidden"
					trigger={content}
				/>
				<HoverCardViewSection
					client={new NotFoundClient()}
					expected={false}
					title="[Not Found] Default"
					trigger={content}
				/>
				<HoverCardViewSection
					client={new NotFoundWithSiteAccessExistsClient()}
					description="I have access to the site, but not the object or object is not-found"
					expected={true}
					title="[Not Found] Access Exists"
					trigger={content}
				/>
				<HoverCardViewSection
					client={new UnAuthClientWithNoAuthFlow()}
					expected={false}
					title="[Unauthorized] Default"
					trigger={content}
				/>
				<HoverCardViewSection
					client={new UnAuthClient()}
					expected={true}
					title="[Unauthorized] With Auth (old)"
					trigger={content}
				/>
				<HoverCardViewSection
					client={new UnAuthClient()}
					expected={true}
					title="[Unauthorized] With Auth (new)"
					trigger={content}
					rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: true }}
				/>
				<HoverCardViewSection client={new ErroredClient()} title="[Error]" trigger={content} />
			</Stack>
		</ExampleContainer>
	);
};
