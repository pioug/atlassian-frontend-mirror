// See Sentry accepted options in here https://docs.sentry.io/error-reporting/configuration/?platform=javascript

import type { Context } from './Context';
import { decorateScope } from './decorateScope';
import { getSentryClient } from './utils/get-sentry-client';

export async function logException(
	ex: Error | unknown,
	name: string,
	context: Context = {},
): Promise<void> {
	try {
		const sentryClient = await getSentryClient();
		if (!sentryClient || typeof sentryClient.captureException !== 'function') {
			return;
		}
		sentryClient.withScope((scope) => {
			decorateScope(scope, context);
			scope.setTag('name', name);
			scope.setTag('packageName', context.packageName ?? 'unknown');
			scope.setTag('packageVersion', context.packageVersion ?? 'unknown');
			sentryClient!.captureException(ex, scope);
		});
	} catch {
		// silence sentry exceptions
	}
}
