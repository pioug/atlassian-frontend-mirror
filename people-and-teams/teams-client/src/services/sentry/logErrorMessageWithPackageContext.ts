// See Sentry accepted options in here https://docs.sentry.io/error-reporting/configuration/?platform=javascript

import { logErrorMessage } from './logErrorMessage';

export const logErrorMessageWithPackageContext =
	(packageContext: { packageName: string; packageVersion: string }) =>
	(...args: Parameters<typeof logErrorMessage>): void => {
		// Intentionally not awaiting the promise here as we don't need the result
		logErrorMessage(args[0], {
			...args[1],
			packageName: packageContext.packageName,
			packageVersion: packageContext.packageVersion,
		});
	};
