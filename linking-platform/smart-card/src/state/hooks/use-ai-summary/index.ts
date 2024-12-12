import { useEffect, useState } from 'react';

import { useIntl } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';

import { AISummaryService } from './ai-summary-service';
import { AISummariesStore } from './ai-summary-service/store';
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

	const { locale } = fg('send_locale_to_summarize_in_assistance-service')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useIntl()
		: { locale: undefined };

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
					...(fg('send_locale_to_summarize_in_assistance-service') && { locale }),
					onError,
					onStart,
					onSuccess,
				}),
			);
		}

		//returns function that calls unsubscribe method
		return AISummariesStore.get(url)?.subscribe(setState);
	}, [url, baseUrl, onError, onStart, onSuccess, product, ari, envKey, locale]);

	const summariseUrl = () => {
		return AISummariesStore.get(url)?.summariseUrl();
	};

	return { summariseUrl, state };
};
