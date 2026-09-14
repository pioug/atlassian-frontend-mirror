// See Sentry accepted options in here https://docs.sentry.io/error-reporting/configuration/?platform=javascript

import type { Severity, SeverityLevel } from '@sentry/types'; // eslint-disable-line import/no-extraneous-dependencies

import type { Context } from './Context';
import { decorateScope } from './decorateScope';
import { getSentryClient } from './utils/get-sentry-client';

export async function logMessage(
	severity: SeverityLevel,
	message: string,
	context: Context = {},
): Promise<void> {
	const sentryClient = await getSentryClient();
	if (!sentryClient || typeof sentryClient.captureException !== 'function') {
		return;
	}

	sentryClient.withScope((scope) => {
		decorateScope(scope, context);
		// The Severity enum is being replaced by SeverityLevel type in v7 anyway
		scope.setLevel(severity as Severity);
		scope.setTag('packageName', context.packageName ?? 'unknown');
		scope.setTag('packageVersion', context.packageVersion ?? 'unknown');
		sentryClient!.captureMessage(message, scope);
	});
}
