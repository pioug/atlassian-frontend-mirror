// See Sentry accepted options in here https://docs.sentry.io/error-reporting/configuration/?platform=javascript

import { createErrorHandler } from './createErrorHandler';
import { type ErrorHandler } from './types';

export const createErrorHandlerWithPackageContext =
	(packageContext: { packageName: string; packageVersion: string }) =>
	(...args: Parameters<typeof createErrorHandler>): ErrorHandler =>
		createErrorHandler({
			...args[0],
			packageName: packageContext.packageName,
			packageVersion: packageContext.packageVersion,
		});
