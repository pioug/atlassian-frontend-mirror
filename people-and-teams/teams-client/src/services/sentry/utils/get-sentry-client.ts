import { type SentryClient } from '../types';
import { sentryClientRef } from './sentry-client-ref';
import { setupSentryClient } from './setup-sentry-client';

export const getSentryClient = async (): Promise<SentryClient | undefined> => {
	if (!sentryClientRef.current) {
		await setupSentryClient({});
	}
	return sentryClientRef.current;
};
