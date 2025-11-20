import React, { useCallback } from 'react';

import Button from '@atlaskit/button/new';
import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	AsanaTask,
	AtlasGoal,
	AtlasProject,
	AtlasProjectNoPreview,
	BitbucketBranch,
	BitbucketCommit,
	BitbucketFile1,
	BitbucketFile2,
	BitbucketProject,
	BitbucketPullRequest1,
	BitbucketPullRequest2,
	BitbucketRepository1,
	BitbucketRepository2,
	BitbucketSourceCodeReference,
	ConfluenceBlogPost,
	ConfluencePage,
	ConfluenceSpace,
	ConfluenceTemplate,
	GithubFile,
	GitHubIssue,
	GithubPullRequest,
	GithubPullRequestJson,
	GithubRepository,
	GithubSourceCodeReference,
	GoogleDoc,
	JiraIssue,
	JiraIssueAssigned,
	JiraProject,
	JiraTasks,
	ProfileObject,
	SlackChannel,
	SlackMessage,
	TrelloBoard,
	TrelloCard,
	YouTubeVideo,
} from '@atlaskit/link-test-helpers';
import { Flex } from '@atlaskit/primitives/compiled';

import { getJsonLdResponse } from '../utils/flexible-ui';

const examples = {
	// Asana examples
	AsanaTask,

	// Atlas examples
	AtlasProject,
	AtlasProjectNoPreview,
	AtlasGoal,

	// Bitbucket examples
	BitbucketBranch,
	BitbucketCommit,
	BitbucketFile1,
	BitbucketFile2,
	BitbucketProject,
	BitbucketPullRequest1,
	BitbucketPullRequest2,
	BitbucketRepository1,
	BitbucketRepository2,
	BitbucketSourceCodeReference,

	// Confluence examples
	ConfluenceBlogPost,
	ConfluencePage,
	ConfluenceSpace,
	ConfluenceTemplate,

	// GitHub examples
	GithubFile,
	GitHubIssue,
	GithubPullRequest,
	GithubPullRequestJson,
	GithubRepository,
	GithubSourceCodeReference,

	// Google Drive examples
	GoogleDoc,

	// Jira examples
	JiraIssue,
	JiraIssueAssigned,
	JiraTasks,
	JiraProject,

	// Profile examples
	ProfileObject,

	// Slack examples
	SlackMessage,
	SlackChannel,

	// Trello examples
	TrelloBoard,
	TrelloCard,

	// YouTube examples
	YouTubeVideo,
};

const JsonldExample = ({
	defaultValue,
	onSelect,
}: {
	defaultValue: JsonLd.Response;
	onSelect: (response: JsonLd.Response) => void;
}): React.JSX.Element => {
	const handleOnClick = useCallback(
		({ data, meta }: any) => {
			const response = getJsonLdResponse(data.url, meta, data);
			onSelect(response);
		},
		[onSelect],
	);

	return (
		<Flex gap="space.050" wrap="wrap">
			<Button onClick={() => handleOnClick(defaultValue)} spacing="compact">
				🦄
			</Button>
			{Object.entries(examples).map(([key, data], idx) => (
				<Button key={idx} onClick={() => handleOnClick(data)} spacing="compact">
					{key}
				</Button>
			))}
		</Flex>
	);
};

export default JsonldExample;
