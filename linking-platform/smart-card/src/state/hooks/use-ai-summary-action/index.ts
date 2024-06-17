import { extractAri, extractLink } from '@atlaskit/link-extractors';
import { type JsonLd } from 'json-ld-types';
import { useCallback } from 'react';
import { useAnalyticsEvents } from '../../../common/analytics/generated/use-analytics-events';
import { failUfoExperience, startUfoExperience, succeedUfoExperience } from '../../analytics';
import { useSmartCardState } from '../../store';
import { useAISummary } from '../use-ai-summary';
import { useAISummaryConfig } from '../use-ai-summary-config';
import type { AISummaryServiceProps } from '../use-ai-summary/ai-summary-service/types';

const EXPERIENCE_NAME = 'smart-link-ai-summary';

const useAISummaryAction = (url: string) => {
	const { baseUrl, envKey, product } = useAISummaryConfig();
	const cardState = useSmartCardState(url);
	const { fireEvent } = useAnalyticsEvents();

	const data = cardState.details?.data as JsonLd.Data.BaseData;
	const ari = data && extractAri(data);
	const dataUrl = (data && extractLink(data)) || '';

	const onStart = useCallback((id: string) => {
		startUfoExperience(EXPERIENCE_NAME, id);
	}, []);

	const onSuccess = useCallback(
		(id: string) => {
			fireEvent('operational.summary.success', {});
			succeedUfoExperience(EXPERIENCE_NAME, id);
		},
		[fireEvent],
	);

	const onError: NonNullable<AISummaryServiceProps['onError']> = useCallback(
		(id, reason) => {
			/**
			 * Errors should only be counted to the SLO if they are not due to acceptable use violations
			 * HIPAA content detected or exceeding context length.
			 */

			const isSloError =
				reason === undefined
					? true
					: ![
							'ACCEPTABLE_USE_VIOLATIONS',
							'HIPAA_CONTENT_DETECTED',
							'EXCEEDING_CONTEXT_LENGTH_ERROR',
						].includes(reason);
			fireEvent('operational.summary.failed', {
				reason: reason || null,
				isSloError,
			});
			failUfoExperience(EXPERIENCE_NAME, id);
		},
		[fireEvent],
	);

	return useAISummary({
		url: dataUrl,
		ari,
		product,
		envKey,
		baseUrl,
		onStart,
		onSuccess,
		onError,
	});
};

export default useAISummaryAction;
