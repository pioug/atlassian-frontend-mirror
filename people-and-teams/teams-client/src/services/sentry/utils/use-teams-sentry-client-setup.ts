import { useCallback, useEffect, useState } from 'react';

import type { SentryClient } from '../types';
import { type SentryClientConfig } from './sentry-client';
import { sentryClientRef } from './sentry-client-ref';
import { setupSentryClient } from './setup-sentry-client';

export const useTeamsSentryClientSetup = (
	isSentryEnabled: boolean,
	config: SentryClientConfig,
): SentryClient | undefined => {
	const [sentryInitialised, setSentryInitialised] = useState(false);

	const setupSentry = useCallback(async () => {
		if (!sentryInitialised && isSentryEnabled && !sentryClientRef.current) {
			await setupSentryClient(config);
		}
	}, [config, isSentryEnabled, sentryInitialised]);

	useEffect(() => {
		setupSentry().then(() => setSentryInitialised(true));
	}, [setupSentry]);

	return sentryClientRef.current;
};
