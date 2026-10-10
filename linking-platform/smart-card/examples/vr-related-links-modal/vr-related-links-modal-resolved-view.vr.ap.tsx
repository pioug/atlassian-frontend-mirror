import React from 'react';

import { SmartCardProvider as Provider } from '@atlaskit/link-provider/smart-card-provider';
import { AsanaTaskJson } from '@atlaskit/link-test-helpers/smart-card/mocks/asana';
import { AtlasGoal, AtlasProject } from '@atlaskit/link-test-helpers/smart-card/mocks/atlas';
import {
	BitbucketProject,
	BitbucketPullRequest1,
	BitbucketPullRequest2,
} from '@atlaskit/link-test-helpers/smart-card/mocks/bitbucket';
import {
	ConfluenceBlogPost,
	ConfluencePage,
} from '@atlaskit/link-test-helpers/smart-card/mocks/confluence';
import { GithubPullRequestJson } from '@atlaskit/link-test-helpers/smart-card/mocks/github';
import { JiraIssue } from '@atlaskit/link-test-helpers/smart-card/mocks/jira';
import { SlackMessage } from '@atlaskit/link-test-helpers/smart-card/mocks/slack';
import type { CardState } from '@atlaskit/linking-common/store';

import RelatedLinksBaseModal from '../../src/view/RelatedLinksModal/components/RelatedLinksBaseModal';
import RelatedLinksResolvedView from '../../src/view/RelatedLinksModal/views/resolved';
import VRTestWrapper from '../utils/vr-test-wrapper';

const initialState = Object.entries({
	[AsanaTaskJson.data.url]: AsanaTaskJson,
	[AtlasProject.data.url]: AtlasProject,
	[AtlasGoal.data.url]: AtlasGoal,
	[BitbucketProject.data.url]: BitbucketProject,
	[BitbucketPullRequest1.data.url]: BitbucketPullRequest1,
	[BitbucketPullRequest2.data.url]: BitbucketPullRequest2,
	[ConfluenceBlogPost.data.url]: ConfluenceBlogPost,
	[ConfluencePage.data.url]: ConfluencePage,
	[SlackMessage.data.url]: SlackMessage,
	[JiraIssue.data.url]: JiraIssue,
	[GithubPullRequestJson.data.url]: GithubPullRequestJson,
}).reduce(
	(prev, [key, details]) => ({
		...prev,
		[key]: { details, status: 'resolved' } as CardState,
	}),
	{},
);

export default (): React.JSX.Element => (
	<VRTestWrapper
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			height: '700px',
		}}
	>
		<Provider storeOptions={{ initialState }}>
			<RelatedLinksBaseModal onClose={() => {}} showModal={true}>
				<RelatedLinksResolvedView
					incomingLinks={[
						ConfluenceBlogPost.data.url,
						AtlasProject.data.url,
						SlackMessage.data.url,
						AsanaTaskJson.data.url,
						BitbucketProject.data.url,
					]}
					outgoingLinks={[
						AtlasGoal.data.url,
						BitbucketPullRequest2.data.url,
						GithubPullRequestJson.data.url,
						ConfluencePage.data.url,
						JiraIssue.data.url,
					]}
				/>
			</RelatedLinksBaseModal>
		</Provider>
	</VRTestWrapper>
);
