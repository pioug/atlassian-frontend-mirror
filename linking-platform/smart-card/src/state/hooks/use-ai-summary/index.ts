import { useCallback, useState, useEffect } from 'react';
import { AISummariesStore } from './ai-summary-service/store';
import { AISummaryService } from './ai-summary-service';
import type {
  AISummaryServiceProps,
  AISummaryStatus,
} from './ai-summary-service/types';
import { useAnalyticsEvents } from '../../../common/analytics/generated/use-analytics-events';
import {
  failUfoExperience,
  startUfoExperience,
  succeedUfoExperience,
} from '../../analytics';

const EXPERIENCE_NAME = 'smart-link-ai-summary';

export const useAISummary = (props: AISummaryServiceProps) => {
  const { url, baseUrl, headers, product } = props;
  const [state, setState] = useState<{
    status: AISummaryStatus;
    content: string;
  }>(AISummariesStore.get(url)?.state || { status: 'ready', content: '' });
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
      fireEvent('operational.summary.failed', { reason: reason || null });
      failUfoExperience(EXPERIENCE_NAME, id);
    },
    [fireEvent],
  );

  useEffect(() => {
    if (!AISummariesStore.get(url)) {
      AISummariesStore.set(
        url,
        new AISummaryService({
          url,
          baseUrl,
          headers,
          onError,
          onStart,
          onSuccess,
          product,
        }),
      );
    }

    //returns function that calls unsubscribe method
    return AISummariesStore.get(url)?.subscribe(setState);
  }, [url, baseUrl, headers, onError, onStart, onSuccess, product]);

  const summariseUrl = () => {
    return AISummariesStore.get(url)?.summariseUrl();
  };

  return { summariseUrl, state };
};
