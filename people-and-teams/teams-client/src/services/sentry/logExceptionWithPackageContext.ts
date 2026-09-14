// See Sentry accepted options in here https://docs.sentry.io/error-reporting/configuration/?platform=javascript

import { logException } from './logException';

export const logExceptionWithPackageContext =
	(packageContext: { packageName: string; packageVersion: string }) =>
	(...args: Parameters<typeof logException>): void => {
		// Intentionally not awaiting the promise here as we don't need the result
		logException(args[0], args[1], {
			...args[2],
			packageName: packageContext.packageName,
			packageVersion: packageContext.packageVersion,
		});
	};
