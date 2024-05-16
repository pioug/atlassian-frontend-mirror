import { useCallback, useState, useEffect } from 'react';
import { AISummariesStore } from './ai-summary-service/store';
import { AISummaryService } from './ai-summary-service';
import type {
  AISummaryServiceProps,
  AISummaryState,
} from './ai-summary-service/types';
import { useAnalyticsEvents } from '../../../common/analytics/generated/use-analytics-events';
import {
  failUfoExperience,
  startUfoExperience,
  succeedUfoExperience,
} from '../../analytics';

const EXPERIENCE_NAME = 'smart-link-ai-summary';

export const useAISummary = (props: AISummaryServiceProps) => {
  const { url, baseUrl, headers, product, ari, envKey } = props;
  const [state, setState] = useState<AISummaryState>(
    AISummariesStore.get(url)?.state || { status: 'ready', content: '' },
  );
  const { fireEvent } = useAnalyticsEvents();

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

      const isSloError = reason === undefined ? true : !['ACCEPTABLE_USE_VIOLATIONS', 'HIPAA_CONTENT_DETECTED', 'EXCEEDING_CONTEXT_LENGTH_ERROR'].includes(reason);
      fireEvent('operational.summary.failed', { reason: reason || null, isSloError});
      failUfoExperience(EXPERIENCE_NAME, id);
    },
    [fireEvent],
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
          headers,
          onError,
          onStart,
          onSuccess,
          product,
          envKey,
        }),
      );
    }

    //returns function that calls unsubscribe method
    return AISummariesStore.get(url)?.subscribe(setState);
  }, [
    url,
    baseUrl,
    headers,
    onError,
    onStart,
    onSuccess,
    product,
    ari,
    envKey,
  ]);

  const summariseUrl = () => {
    return AISummariesStore.get(url)?.summariseUrl();
  };

  return { summariseUrl, state };
};
