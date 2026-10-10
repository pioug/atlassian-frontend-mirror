import React, { useCallback } from 'react';

import Button from '@atlaskit/button/default/button';
import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { AsanaTask } from '@atlaskit/link-test-helpers/smart-card/mocks/asana';
import {
	AtlasGoal,
	AtlasProject,
	AtlasProjectNoPreview,
} from '@atlaskit/link-test-helpers/smart-card/mocks/atlas';
import {
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
} from '@atlaskit/link-test-helpers/smart-card/mocks/bitbucket';
import {
	ConfluenceBlogPost,
	ConfluencePage,
	ConfluenceSpace,
	ConfluenceTemplate,
} from '@atlaskit/link-test-helpers/smart-card/mocks/confluence';
import { GoogleDoc } from '@atlaskit/link-test-helpers/smart-card/mocks/gdrive';
import {
	GithubFile,
	GitHubIssue,
	GithubPullRequest,
	GithubPullRequestJson,
	GithubRepository,
	GithubSourceCodeReference,
} from '@atlaskit/link-test-helpers/smart-card/mocks/github';
import {
	JiraIssue,
	JiraIssueAssigned,
	JiraProject,
	JiraTasks,
} from '@atlaskit/link-test-helpers/smart-card/mocks/jira';
import { ProfileObject } from '@atlaskit/link-test-helpers/smart-card/mocks/profile';
import { SlackChannel, SlackMessage } from '@atlaskit/link-test-helpers/smart-card/mocks/slack';
import { TrelloBoard, TrelloCard } from '@atlaskit/link-test-helpers/smart-card/mocks/trello';
import { YouTubeVideo } from '@atlaskit/link-test-helpers/smart-card/mocks/youtube';
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
