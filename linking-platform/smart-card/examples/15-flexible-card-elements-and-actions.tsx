import React from 'react';

import { Label } from '@atlaskit/form';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { Grid } from '@atlaskit/primitives';
import { Box, Flex, Stack, Text } from '@atlaskit/primitives/compiled';
import Range from '@atlaskit/range';

import {
	AssignedToElement,
	AssignedToGroupElement,
	AttachmentCountElement,
	AuthorGroupElement,
	Card,
	ChecklistProgressElement,
	CollaboratorGroupElement,
	CommentCountElement,
	CopyLinkAction,
	CreatedByElement,
	CreatedOnElement,
	CustomAction,
	DownloadAction,
	DueOnElement,
	FollowAction,
	LatestCommitElement,
	LinkIconElement,
	LocationElement,
	ModifiedByElement,
	ModifiedOnElement,
	OwnedByElement,
	OwnedByGroupElement,
	PreviewAction,
	PreviewElement,
	PriorityElement,
	ProgrammingLanguageElement,
	ProviderElement,
	ReactCountElement,
	ReadTimeElement,
	SentOnElement,
	SnippetElement,
	SourceBranchElement,
	StateElement,
	StoryPointsElement,
	SubscriberCountElement,
	SubTasksProgressElement,
	TargetBranchElement,
	TitleElement,
	UnresolvedAction,
	ViewCountElement,
	VoteCountElement,
} from '../src';

import { unicornResponse } from './content/example-responses';
import {
	ForbiddenClient,
	ForbiddenWithObjectRequestAccessClient,
	ForbiddenWithSiteDeniedRequestClient,
	ForbiddenWithSiteDirectAccessClient,
	ForbiddenWithSiteForbiddenClient,
	ForbiddenWithSitePendingRequestClient,
	ForbiddenWithSiteRequestAccessClient,
	NotFoundWithSiteAccessExistsClient,
	UnAuthClient,
	UnicornResolvedClient,
} from './utils/custom-client';
import ExampleContainer from './utils/example-container';

export default () => {
	const [cols, setCols] = React.useState<number>(1);
	const [templateColumns, setTemplateColumns] = React.useState<string>('1fr');

	return (
		<ExampleContainer title="FlexibleCard elements and actions">
			<SmartCardProvider client={new UnicornResolvedClient()}>
				<Stack space="space.050">
					<Label htmlFor="cols-input">Grid columns: {cols}</Label>
					<Range
						aria-label="controlled range"
						step={1}
						min={1}
						max={5}
						onChange={(value) => {
							setCols(value);
							setTemplateColumns('1fr '.repeat(value).trim());
						}}
						value={cols}
					/>
				</Stack>
				<Card
					appearance="block"
					ui={{ removeBlockRestriction: true }}
					url={unicornResponse.data.url}
				>
					<Stack space="space.050">
						<Box
							backgroundColor="color.background.neutral"
							paddingBlock="space.050"
							paddingInline="space.100"
						>
							<Text size="large">Elements</Text>
						</Box>
						<Grid gap="space.100" templateColumns={templateColumns}>
							<AssignedToElement />
							<AssignedToGroupElement />
							<AttachmentCountElement />
							<AuthorGroupElement />
							<ChecklistProgressElement />
							<CollaboratorGroupElement />
							<CommentCountElement />
							<CreatedByElement />
							<CreatedOnElement />
							<DueOnElement />
							<LatestCommitElement />
							<LinkIconElement />
							<LocationElement />
							<ModifiedByElement />
							<ModifiedOnElement />
							<OwnedByElement />
							<OwnedByGroupElement />
							<PreviewElement />
							<PriorityElement />
							<ProgrammingLanguageElement />
							<ProviderElement />
							<ReactCountElement />
							<ReadTimeElement />
							<SentOnElement />
							<SnippetElement />
							<SourceBranchElement />
							<StateElement />
							<StoryPointsElement />
							<SubscriberCountElement />
							<SubTasksProgressElement />
							<TargetBranchElement />
							<TitleElement />
							<ViewCountElement />
							<VoteCountElement />
						</Grid>
						<Box
							backgroundColor="color.background.neutral"
							paddingBlock="space.050"
							paddingInline="space.100"
						>
							<Text size="large">Actions</Text>
						</Box>
						<Grid gap="space.100" templateColumns={templateColumns}>
							<Flex gap="space.050" wrap="wrap">
								<CustomAction onClick={() => alert('Click!')}>Custom</CustomAction>
								<CustomAction appearance="subtle" onClick={() => alert('Click!')}>
									Custom
								</CustomAction>
							</Flex>
							<Flex gap="space.050" wrap="wrap">
								<CopyLinkAction />
								<CopyLinkAction appearance="subtle" />
							</Flex>
							<Flex gap="space.050" wrap="wrap">
								<DownloadAction />
								<DownloadAction appearance="subtle" />
							</Flex>
							<Flex gap="space.050" wrap="wrap">
								<FollowAction />
								<FollowAction appearance="subtle" />
							</Flex>
							<Flex gap="space.050" wrap="wrap">
								<PreviewAction />
								<PreviewAction appearance="subtle" />
							</Flex>
						</Grid>
					</Stack>
				</Card>
			</SmartCardProvider>
			<Box
				backgroundColor="color.background.neutral"
				paddingBlock="space.050"
				paddingInline="space.100"
			>
				<Text size="large">UnresolvedAction</Text>
			</Box>
			<Flex columnGap="space.050" wrap="wrap">
				{[
					new ForbiddenClient(),
					new ForbiddenWithSiteRequestAccessClient(),
					new ForbiddenWithSitePendingRequestClient(),
					new ForbiddenWithSiteDeniedRequestClient(),
					new ForbiddenWithSiteDirectAccessClient(),
					new ForbiddenWithObjectRequestAccessClient(),
					new ForbiddenWithSiteForbiddenClient(),
					new NotFoundWithSiteAccessExistsClient(),
					new UnAuthClient(),
				].map((client) => (
					<SmartCardProvider client={client}>
						<Card appearance="block" ui={{ removeBlockRestriction: true }} url="https://some-url">
							<UnresolvedAction />
						</Card>
					</SmartCardProvider>
				))}
			</Flex>
		</ExampleContainer>
	);
};
