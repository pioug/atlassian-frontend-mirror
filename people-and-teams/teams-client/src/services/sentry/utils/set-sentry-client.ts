import { type SentryClient } from '../types';

import { sentryClientRef } from './sentry-client-ref';

export const setSentryClient = (client: SentryClient): void => {
	sentryClientRef.current = client;
};
