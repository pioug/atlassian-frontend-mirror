export { flushPromises } from './flushPromises';
export { renderWithIntl, asyncAct } from './react-testing-library';
export { default as ManualPromise } from './manual-promise';
export {
	MockIntersectionObserverFactory,
	type MockIntersectionObserverOpts,
	mockSimpleIntersectionObserver,
} from './intersection-observer';
export { withWaitForItem } from './withWaitForItem';

// Export all mock clients and related utilities
export {
	overrideEmbedContent,
	mocks,
	// Client classes
	ResolvedClient,
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
} from './smart-card';
