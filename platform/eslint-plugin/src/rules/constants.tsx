// List of libraries that we maintain or have worked on
// - eg `@atlaskit/feature-gate-js-client` shouldn't be included in here
export const FEATURE_API_IMPORT_SOURCES = new Set([
	'@atlassian/jira-feature-flagging',
	'@atlassian/jira-feature-flagging-using-meta',
	'@atlassian/jira-feature-gating',
	'@atlassian/jira-feature-experiments',
	'@atlaskit/platform-feature-flags',
	'@atlassian/repo-feature-flags-statsig',
]);

export const FEATURE_MOCKS_IMPORT_SOURCES = new Set([
	'@atlassian/jira-feature-flagging-mocks',
	'@atlassian/jira-feature-gates-test-mocks',
	'@atlassian/jira-feature-gates-storybook-mocks',
]);

export const FEATURE_UTILS_IMPORT_SOURCES = new Set([
	'@atlassian/jira-feature-flagging-utils',
	'@atlassian/jira-feature-gate-component',
]);
