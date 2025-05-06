import type {
	BrowserOptions,
	captureException,
	captureMessage as captureMessageSentry,
	init,
	Integrations,
	Scope,
} from '@sentry/browser';

/** Duplicated type to avoid a dependency on teams-common */
export type CreateErrorHandler = (
	meta: {
		packageName: string;
		packageVersion: string;
		teamName: string;
	},
	commonTags?: Record<string, string>,
) => ErrorHandler;

export type ErrorHandler = (error: Error, message: string, tags?: Record<string, string>) => void;

// See Sentry accepted options in here https://docs.sentry.io/error-reporting/configuration/?platform=javascript
export interface SentryOptions extends BrowserOptions {
	whitelistUrls?: (string | RegExp)[];
	ignoreUrls?: (string | RegExp)[];
}

export interface SentryTags {
	[key: string]: string;
}

export interface SentryClient {
	init: typeof init;
	Integrations: typeof Integrations;
	withScope(callback: (scope: Scope) => void): void;
	captureMessage: typeof captureMessageSentry;
	captureException: typeof captureException;
}

export interface SentryInstallConfig {
	env?: string;
	version?: string;
	noGlobals?: boolean;
	/**
	 * @deprecated use `initialScope` instead
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	tags?: SentryTags;
	initialScope?: {
		tags?: SentryTags;
	};
	dsn?: string;
	attachStacktrace?: boolean;
}
