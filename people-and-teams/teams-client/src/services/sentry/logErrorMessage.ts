// See Sentry accepted options in here https://docs.sentry.io/error-reporting/configuration/?platform=javascript

import type { Context } from './Context';
import { logMessage } from './logMessage';

export function logErrorMessage(message: string, context: Context = {}): void {
	logMessage('error', message, context).catch(() => {});
}
