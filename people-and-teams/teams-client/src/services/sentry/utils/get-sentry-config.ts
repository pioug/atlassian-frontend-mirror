import { SENTRY_DSN } from '../constants';
import { type SentryInstallConfig, type SentryOptions } from '../types';

const DEFAULT_SENTRY_CONFIG = {
	whitelistUrls: [
		/atl-paas.net/,
		// test local host
		/localhost/,
	],
	ignoreErrors: [
		/^SentryIgnore:/,
		// Network related errors
		'The operation was aborted',
		'Software caused connection abort',
		'GraphQL error: Failed to fetch',
		'TypeError: Failed to fetch',
		'TypeError: NetworkError when attempting to fetch resource.',
		'AbortError: The user aborted a request.',
		/^network error/i,
		/^network failure/i,
		/^NetworkError/i,
		/^Unexpected token ..*/,
	],
	ignoreUrls: [
		// Chrome extensions
		/extensions\//i,
		/^chrome:\/\//i,
	],
	dsn: SENTRY_DSN,
	attachStacktrace: true,
};

// return value is an Sentry configuration object:
// https://docs.sentry.io/learn/configuration/?platform=javascript
export function getSentryConfig(options: SentryInstallConfig): SentryOptions {
	const { env, version, noGlobals: _, ...otherOptions } = options;
	return {
		...otherOptions,
		...DEFAULT_SENTRY_CONFIG,
		// Standalone __VERSION__ is set from `bin/set-release-version.sh`
		// when building to deploy to production
		release:
			`${process.env._PACKAGE_NAME_}@${process.env._PACKAGE_VERSION_}` ||
			// @ts-ignore Jira  - window.BUILD_KEY
			window.BUILD_KEY ||
			// @ts-ignore Confluence - window.__buildInfo
			window.__buildInfo?.FRONTEND_VERSION ||
			'---',
		environment: env || 'prod',
	};
}
