import { useState, useEffect } from 'react';
import { AISummariesStore } from './ai-summary-service/store';
import { AISummaryService } from './ai-summary-service';
import type { AISummaryServiceProps, AISummaryState } from './ai-summary-service/types';

/**
 * Stream AI summary for an url.
 * For hook specific to AI summary on as a smart link, please see useAISummaryAction.
 */
export const useAISummary = (props: AISummaryServiceProps) => {
	const { url, baseUrl, product, ari, envKey, onError, onStart, onSuccess } = props;
	const [state, setState] = useState<AISummaryState>(
		AISummariesStore.get(url)?.state || { status: 'ready', content: '' },
	);

	useEffect(() => {
		//do not create a service for the empty URL string when the link data is not yet available,
		//or the service has already been created and cached.
		if (url && !AISummariesStore.get(url)) {
			AISummariesStore.set(
				url,
				new AISummaryService({
					url,
					ari,
					baseUrl,
					product,
					envKey,
					onError,
					onStart,
					onSuccess,
				}),
			);
		}

		//returns function that calls unsubscribe method
		return AISummariesStore.get(url)?.subscribe(setState);
	}, [url, baseUrl, onError, onStart, onSuccess, product, ari, envKey]);

	const summariseUrl = () => {
		return AISummariesStore.get(url)?.summariseUrl();
	};

	return { summariseUrl, state };
};
