import { useCallback, useEffect, useState } from 'react';

import type { SentryClient } from '../types';

import { sentryClient, type SentryClientConfig, setupSentryClient } from './sentry-client';

export const useTeamsSentryClientSetup = (isSentryEnabled: boolean, config: SentryClientConfig): SentryClient | undefined => {
	const [sentryInitialised, setSentryInitialised] = useState(false);

	const setupSentry = useCallback(async () => {
		if (!sentryInitialised && isSentryEnabled && !sentryClient) {
			await setupSentryClient(config);
		}
	}, [config, isSentryEnabled, sentryInitialised]);

	useEffect(() => {
		setupSentry().then(() => setSentryInitialised(true));
	}, [setupSentry]);

	return sentryClient;
};
