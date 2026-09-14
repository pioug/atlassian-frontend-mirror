// See Sentry accepted options in here https://docs.sentry.io/error-reporting/configuration/?platform=javascript

import type { Context } from './Context';
import { logMessage } from './logMessage';

export function logInfoMessage(message: string, context: Context = {}): void {
	logMessage('info', message, context).catch(() => {});
}
