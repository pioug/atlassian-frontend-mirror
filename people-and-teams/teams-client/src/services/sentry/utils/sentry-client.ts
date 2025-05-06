import { SENTRY_DSN } from '../constants';
import { type SentryClient } from '../types';

import { initialiseSentry } from './initialise-sentry';

export type SentryClientConfig = {
	appName?: string;
	env?: string;
};

export let sentryClient: SentryClient | undefined;

export const setSentryClient = (client: SentryClient) => {
	sentryClient = client;
};

export const getSentryClient = async () => {
	if (!sentryClient) {
		await setupSentryClient({});
	}
	return sentryClient;
};

export async function setupSentryClient({ appName, env }: SentryClientConfig) {
	const sentryClient = await requireSentryLib();
	if (!sentryClient) {
		return;
	}

	// initialiseSentry sets the sentry client
	initialiseSentry(sentryClient, {
		initialScope: {
			tags: {
				renderMode: appName || 'unknown',
				productBuild:
					// @ts-ignore Jira  - window.BUILD_KEY, confluence - window.__buildInfo
					window.BUILD_KEY || window.__buildInfo?.FRONTEND_VERSION || 'unknown',
				product: getProduct(),
			},
		},
		env,
		noGlobals: true,
		dsn: SENTRY_DSN,
		attachStacktrace: true,
	});
}

async function requireSentryLib(): Promise<SentryClient | undefined> {
	// saving ~40K
	try {
		return import(/* webpackChunkName: "teams-client_sentry" */ '@sentry/browser');
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn('Ignoring rejected promise when loading sentry resource.', error);
	}
}

function getProduct() {
	const path = window.location.pathname;
	if (path.includes('/jira/people')) {
		return 'jira';
	} else if (path.includes('/wiki/people')) {
		return 'confluence';
	}
	return 'unknown';
}
