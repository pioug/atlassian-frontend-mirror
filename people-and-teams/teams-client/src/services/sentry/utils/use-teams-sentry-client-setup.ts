import { useCallback, useEffect, useState } from 'react';

import { sentryClient, type SentryClientConfig, setupSentryClient } from './sentry-client';

export const useTeamsSentryClientSetup = (isSentryEnabled: boolean, config: SentryClientConfig) => {
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
