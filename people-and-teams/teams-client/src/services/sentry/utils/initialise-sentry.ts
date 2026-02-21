import { type SentryClient, type SentryInstallConfig } from '../types';

import { getSentryConfig } from './get-sentry-config';
import { sentryClient, setSentryClient } from './sentry-client';

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
	if (sentryClient) {
		return;
	}

	if (!client) {
		return;
	}

	setSentryClient(client);

	const sentryConfig = getSentryConfig(options);

	sentryClient!.init({
		...sentryConfig,
		integrations: function (integrations) {
			return integrations.filter(function (integration) {
				return DISABLED_INTEGRATIONS.indexOf(integration.name) === -1;
			});
		},
	});
}
