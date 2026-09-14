// See Sentry accepted options in here https://docs.sentry.io/error-reporting/configuration/?platform=javascript

import type { Breadcrumb } from '@sentry/browser';

import { getSentryClient } from './utils/get-sentry-client';

export async function addBreadcrumb(crumb: string | Breadcrumb): Promise<void> {
	const sentryClient = await getSentryClient();

	sentryClient!.withScope((scope) => {
		scope.addBreadcrumb(typeof crumb === 'string' ? { message: crumb } : crumb);
	});
}
