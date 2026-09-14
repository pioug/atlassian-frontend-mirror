// See Sentry accepted options in here https://docs.sentry.io/error-reporting/configuration/?platform=javascript

import { logInfoMessage } from './logInfoMessage';

export const logInfoMessageWithPackageContext =
	(packageContext: { packageName: string; packageVersion: string }) =>
	(...args: Parameters<typeof logInfoMessage>): void => {
		// Intentionally not awaiting the promise here as we don't need the result
		logInfoMessage(args[0], {
			...args[1],
			packageName: packageContext.packageName,
			packageVersion: packageContext.packageVersion,
		});
	};
