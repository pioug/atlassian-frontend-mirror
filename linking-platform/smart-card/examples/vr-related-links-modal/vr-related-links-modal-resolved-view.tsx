/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import VRTestWrapper from '../utils/vr-test-wrapper';
import RelatedLinksResolvedView from '../../src/view/RelatedLinksModal/views/resolved';
import { Provider } from '@atlaskit/smart-card';
import type { CardState } from '@atlaskit/linking-common';
import {
	AsanaTaskJson,
	AtlasGoal,
	AtlasProject,
	BitbucketProject,
	BitbucketPullRequest1,
	BitbucketPullRequest2,
	ConfluenceBlogPost,
	ConfluencePage,
	GithubPullRequestJson,
	JiraIssue,
	SlackMessage,
} from '../../examples-helpers/_jsonLDExamples';
import RelatedLinksBaseModal from '../../src/view/RelatedLinksModal/components/RelatedLinksBaseModal';

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

export default () => (
	<VRTestWrapper
		overrideCss={css({
			height: '700px',
		})}
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
