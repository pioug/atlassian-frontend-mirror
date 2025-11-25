import {
	Integrations,
	type BrowserOptions,
	type EventHint,
	type Scope,
	type Event as SentryEvent,
} from '@sentry/browser';
import type { Integration, Primitive } from '@sentry/types';

import { fg } from '@atlaskit/platform-feature-flags';

import { isFedRamp } from './environment';
import {
	normaliseSentryBreadcrumbs,
	SERIALIZABLE_ATTRIBUTES,
} from './normalise-sentry-breadcrumbs';

const SENTRY_DSN =
	'https://0b10c8e02fb44d8796c047b102c9bee8@o55978.ingest.sentry.io/4505129224110080';

const packageName = 'editor-common'; // Sentry doesn't accept '/' in its releases https://docs.sentry.io/platforms/javascript/configuration/releases/
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const sanitiseSentryEvents = (
	data: SentryEvent,
	_hint?: EventHint,
): PromiseLike<SentryEvent | null> | SentryEvent | null => {
	// Remove URL as it has UGC
	// Ignored via go/ees007
	// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
	// TODO: Sanitise the URL instead of just removing it
	if (data.request) {
		delete data.request.url;
	}

	return data;
};

export const logException = async (error: Error, tags?: { [key: string]: Primitive }) => {
	try {
		// We don't want to log exceptions for branch deploys or in development / test scenarios
		if (process.env.NODE_ENV !== 'production' || process.env.CLOUD_ENV === 'branch') {
			return;
		}

		const { BrowserClient, defaultIntegrations, getCurrentHub } = await import(
			/* webpackChunkName: "@atlaskit-internal_editor-sentrybrowser" */ '@sentry/browser'
		);
		const { ExtraErrorData } = await import(
			/* webpackChunkName: "@atlaskit-internal_editor-sentryintegrations" */ '@sentry/integrations'
		);

		const breadcrumbsIntegration = fg('platform_editor_sentry_breadcrumbs')
			? new Integrations.Breadcrumbs({
					// only enable breadcrumbs for dom (UI clicks and inputs)
					// include 'data-test-id', 'data-testid' in the breadcrumbs if they are found
					dom: {
						serializeAttribute: SERIALIZABLE_ATTRIBUTES,
					},
					fetch: false,
					xhr: false,
					console: false,
					history: false,
					sentry: false,
				})
			: undefined;

		const sentryOptions: BrowserOptions = {
			dsn: isFedRamp() ? undefined : SENTRY_DSN,
			release: `${packageName}@${packageVersion}`,
			environment: process.env.CLOUD_ENV ?? 'unknown',
			beforeBreadcrumb: fg('platform_editor_sentry_breadcrumbs')
				? normaliseSentryBreadcrumbs
				: undefined,
			ignoreErrors: [
				// Network issues
				// Ignored via go/ees005
				// eslint-disable-next-line require-unicode-regexp
				/^network error/i,
				// Ignored via go/ees005
				// eslint-disable-next-line require-unicode-regexp
				/^network failure/i,
				'TypeError: Failed to fetch',
				// A benign error, see https://stackoverflow.com/a/50387233/2645305
				'ResizeObserver loop limit exceeded',
				// Ignored via go/ees005
				// eslint-disable-next-line require-unicode-regexp
				/ResizeObserver loop completed with undelivered notifications/,
			],
			autoSessionTracking: false,
			integrations: (_integrations: Integration[]): Integration[] => [
				// Remove the Breadcrumbs integration from the default as it's too likely to log UGC/PII
				// https://docs.sentry.io/platforms/javascript/configuration/integrations/default/
				...defaultIntegrations.filter(({ name }) => name !== 'Breadcrumbs'),
				...(breadcrumbsIntegration ? [breadcrumbsIntegration] : []),
				// Extracts all non-native attributes from the error object and attaches them to the event as the extra data
				// https://docs.sentry.io/platforms/javascript/configuration/integrations/plugin/?original_referrer=https%3A%2F%2Fduckduckgo.com%2F#extraerrordata
				new ExtraErrorData(),
			],
			beforeSend: sanitiseSentryEvents,
		};
		// Use a client to avoid picking up the errors from parent applications
		const client = new BrowserClient(sentryOptions);
		const hub = getCurrentHub();
		// @ts-ignore - TypeScript 5.9.2 upgrade
		hub.bindClient(client);

		hub.withScope((scope: Scope) => {
			scope.setTags({
				// Jira environment variables
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				'jira-bundler': (window as any).BUNDLER_VERSION,
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				'jira-variant': (window as any).BUILD_VARIANT,
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				'jira-release': (window as any).BUILD_KEY,
				// Confluence environment variables
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				'confluence-frontend-version': (window as any).__buildInfo?.FRONTEND_VERSION,
				...tags,
			});
			// Explicitly remove the breadcrumbs as it's too likely to log UGC/PII to side-step the hub integrations not being respected
			scope.clearBreadcrumbs();

			hub.captureException(error);
		});

		// @ts-ignore - TypeScript 5.9.2 upgrade
		return client.close();
	} catch (_error) {
		// Error reporting failed, we don't want this to generate more errors
	}
};
