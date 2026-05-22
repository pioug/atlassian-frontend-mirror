/** @deprecated Use @atlaskit/link-test-helpers/promise/flush-promises */
export { flushPromises } from './flushPromises';

/** @deprecated Use @atlaskit/link-test-helpers/react-testing-library */
export { renderWithIntl, asyncAct } from './react-testing-library';

/** @deprecated Use @atlaskit/link-test-helpers/promise/manual-promise */
export { default as ManualPromise } from './manual-promise';

/** @deprecated Use @atlaskit/link-test-helpers/intersection-observer */
export {
	MockIntersectionObserverFactory,
	type MockIntersectionObserverOpts,
	mockSimpleIntersectionObserver,
} from './intersection-observer';

/** @deprecated Use @atlaskit/link-test-helpers/with-wait-for-item */
export { withWaitForItem } from './withWaitForItem';

// Export all mock clients and related utilities
/**
 * @deprecated Use the specific entry points instead:
 * - Clients: @atlaskit/link-test-helpers/smart-card/mocks/clients
 * - Asana mocks: @atlaskit/link-test-helpers/smart-card/mocks/asana
 * - Atlas mocks: @atlaskit/link-test-helpers/smart-card/mocks/atlas
 * - Bitbucket mocks: @atlaskit/link-test-helpers/smart-card/mocks/bitbucket
 * - Confluence mocks: @atlaskit/link-test-helpers/smart-card/mocks/confluence
 * - Dynamic icons: @atlaskit/link-test-helpers/smart-card/mocks/dynamic-icons
 * - Embed content: @atlaskit/link-test-helpers/smart-card/mocks/embed-content
 * - Google Drive mocks: @atlaskit/link-test-helpers/smart-card/mocks/gdrive
 * - GitHub mocks: @atlaskit/link-test-helpers/smart-card/mocks/github
 * - Jira mocks: @atlaskit/link-test-helpers/smart-card/mocks/jira
 * - Profile mocks: @atlaskit/link-test-helpers/smart-card/mocks/profile
 * - Slack mocks: @atlaskit/link-test-helpers/smart-card/mocks/slack
 * - Trello mocks: @atlaskit/link-test-helpers/smart-card/mocks/trello
 * - YouTube mocks: @atlaskit/link-test-helpers/smart-card/mocks/youtube
 * - Unicorn mocks: @atlaskit/link-test-helpers/smart-card/mocks/unicorn
 * - Images: @atlaskit/link-test-helpers/smart-card/images
 */
export {
	overrideEmbedContent,
	mocks,
	// Client classes
	ResolvedClient,
	ResolvedClientWithDelay,
	ResolvingClient,
	ErroredClient,
	ForbiddenClient,
	ForbiddenWithObjectRequestAccessClient,
	ForbiddenWithSiteDeniedRequestClient,
	ForbiddenWithSiteDirectAccessClient,
	ForbiddenWithSiteForbiddenClient,
	ForbiddenWithSitePendingRequestClient,
	ForbiddenWithSiteRequestAccessClient,
	ForbiddenClientWithNoIcon,
	NotFoundClient,
	NotFoundWithSiteAccessExistsClient,
	NotFoundWithNoIconClient,
	UnAuthClient,
	UnAuthClientWithProviderImage,
	UnAuthClientWithNoAuthFlow,
	UnAuthClientWithNoIcon,
	UnicornResolvedClient,
	// URL constants
	ResolvedClientUrl,
	ResolvedClientUrlNoPreview,
	ResolvedClientEmbedUrl,
	ResolvedClientEmbedInteractiveUrl,
	ResolvedClientWithLongTitleUrl,
	ResolvedClientWithTextHighlightInTitleUrl,
	ResolvedClientProfileUrl,
	ResolvingClientUrl,
	// Avatar images
	avatar1,
	avatarSquare,
	avatar2,
	avatar3,
	slackLogo,

	// Error state images
	imageForbiddenJiraEmbed,
	forbiddenJira,

	// Link images
	image1,
	image2,

	// Icons
	iconAtlas,
	iconBitbucket,
	iconGoogleDrive,
	iconTrello,
	// Asana examples
	AsanaTaskJson,
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

	// Dynamic icons utilities
	generateContext,
	type GenerateContextProp,

	// GitHub examples
	GithubFile,
	GitHubIssue,
	GithubPullRequest,
	GithubPullRequestJson,
	GithubRepository,
	GithubSourceCodeReference,

	// Google Drive examples
	GoogleDoc,
	GoogleDocUrl,

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
	YouTubeVideoUrl,

	// Response examples
	unicornResponse,
	response1,
	response2,
	response3,
	response4,
	url,
	MockCardClient,
} from './smart-card';
