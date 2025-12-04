// Export all mock clients and related utilities
export { overrideEmbedContent } from './example-helpers/_jsonLDExamples/utils';
export {
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
} from './mock-clients';

// Export the mock card client
export { MockCardClient } from './mock-clients/mock-card-client';

// Export all images and icons
export {
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
	iconFigma,
	iconDropbox,
	iconOneDrive,
	iconSlack,
	iconTrello,
} from './images';

// Export all example helpers and JSON-LD examples
export {
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
} from './example-helpers';

export {
	unicornResponse,
	response1,
	response2,
	response3,
	response4,
	url,
} from './example-helpers/_jsonLDExamples';
