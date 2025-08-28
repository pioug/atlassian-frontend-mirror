// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

/**
 * Use when fg('platform_editor_typography_ugc') is disabled.
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const editorUGCTokensDefault: SerializedStyles = css({
	'--editor-font-ugc-token-heading-h1':
		'normal 500 1.71429em/1.16667 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-heading-h2':
		'normal 500 1.42857em/1.2 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-heading-h3':
		'normal 600 1.14286em/1.25 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-heading-h4':
		'normal 600 1em/1.14286 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-heading-h5':
		'normal 600 0.857143em/1.33333 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-heading-h6':
		'normal 700 0.785714em/1.45455 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-body':
		'normal 400 1em/1.714 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-weight-heading-bold': '700',
});

/**
 * Use when fg('platform_editor_typography_ugc') is enabled, but none of the following are enabled:
 * - fg('platform-dst-jira-web-fonts')
 * - fg('atlas_editor_typography_refreshed')
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const editorUGCTokensModernized: SerializedStyles = css({
	'--editor-font-ugc-token-heading-h1':
		'normal 600 1.71429em/1.16667 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-heading-h2':
		'normal 600 1.42857em/1.2 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-heading-h3':
		'normal 600 1.14286em/1.25 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-heading-h4':
		'normal 600  1em/1.14286 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-heading-h5':
		'normal 600  0.857143em/1.33333 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-heading-h6':
		'normal 600 0.785714em/1.45455 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-body':
		'normal 400 1em/1.714 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-weight-heading-bold': '700',
});

/**
 * Use when fg('platform_editor_typography_ugc') is enabled and one of the following are enabled:
 * - fg('platform-dst-jira-web-fonts')
 * - fg('atlas_editor_typography_refreshed')
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const editorUGCTokensRefreshed: SerializedStyles = css({
	'--editor-font-ugc-token-heading-h1':
		'normal 600 1.71429em/1.16667 "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-heading-h2':
		'normal 600 1.42857em/1.2 "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-heading-h3':
		'normal 600 1.14286em/1.25 "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-heading-h4':
		'normal 600 1em/1.14286 "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-heading-h5':
		'normal 600 0.857143em/1.33333 "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-heading-h6':
		'normal 600 0.785714em/1.45455 "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-body':
		'normal 400 1em/1.714 "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	'--editor-font-ugc-token-weight-heading-bold': '700',
});
