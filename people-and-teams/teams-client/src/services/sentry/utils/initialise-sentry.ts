import { type SentryClient, type SentryInstallConfig } from '../types';

import { getSentryConfig } from './get-sentry-config';
import { sentryClientRef } from './sentry-client-ref';
import { setSentryClient } from './set-sentry-client';

const DISABLED_INTEGRATIONS = [
	'onerror',
	'onunhandledrejection',
	// In Jira this integration is being initialised twice, resulting in no events being sent to Sentry
	'Dedupe',
];

export async function initialiseSentry(
	client: SentryClient,
	options: SentryInstallConfig,
): Promise<void> {
	if (sentryClientRef.current) {
		return;
	}

	if (!client) {
		return;
	}

	setSentryClient(client);

	const sentryConfig = getSentryConfig(options);

	sentryClientRef.current!.init({
		...sentryConfig,
		integrations: function (integrations) {
			return integrations.filter(function (integration) {
				return DISABLED_INTEGRATIONS.indexOf(integration.name) === -1;
			});
		},
	});
}
