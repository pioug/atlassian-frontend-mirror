import React from 'react';

import { Label } from '@atlaskit/form';
import type { JsonLd } from '@atlaskit/json-ld-types';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { Box, Flex, Grid, Stack, Text } from '@atlaskit/primitives';
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
	ViewCountElement,
	VoteCountElement,
} from '../../src';

import { unicornResponse } from './example-responses';

class UnicornResolvedClient extends CardClient {
	fetchData(url: string): Promise<JsonLd.Response> {
		return Promise.resolve(unicornResponse as JsonLd.Response);
	}
}
export default () => {
	const [cols, setCols] = React.useState<number>(1);
	const [templateColumns, setTemplateColumns] = React.useState<string>('1fr');

	return (
		<SmartCardProvider client={new UnicornResolvedClient()}>
			<Card appearance="block" ui={{ removeBlockRestriction: true }} url={unicornResponse.data.url}>
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
	);
};
