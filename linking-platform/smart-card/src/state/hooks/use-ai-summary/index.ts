import { useState, useEffect, useMemo } from 'react';
import { AISummariesStore } from './ai-summary-service/store';
import { AISummaryService } from './ai-summary-service';
import type {
  AISummaryServiceProps,
  AISummaryStatus,
} from './ai-summary-service/types';

export const useAISummary = (props: AISummaryServiceProps) => {
  const { url, baseUrl, product, headers } = props;
  const [state, setState] = useState<{
    status: AISummaryStatus;
    content: string;
  }>(AISummariesStore.get(url)?.state || { status: 'ready', content: '' });

  // Can be used to know the summary status upon mounting a component (HoverCard UI state for example).
  // For other scenarios, opt for dynamic status updates via state.status.
  const isSummarisedOnMount = useMemo(
    () => AISummariesStore.get(url)?.state.status === 'done',
    [url],
  );

  useEffect(() => {
    // Create or subscribe to an AI service only if a summary has not been previously generated.
    // Otherwise, use the data from the current state synchronized with a cache (AISummariesStore).
    if (!isSummarisedOnMount) {
      const aISummaryService = AISummariesStore.get(url);
      const isAISummaryServiceInitiated = !!aISummaryService;

      if (isAISummaryServiceInitiated) {
        //if we want to subscribe to updates from an existing AI service that has not yet provided a summary or is currently in progress.
        const unsubscribe = aISummaryService.subscribe(setState);
        return () => unsubscribe();
      } else {
        //if we want to create a new AI service and wish to subscribe for updates
        AISummariesStore.set(
          url,
          new AISummaryService({ url, baseUrl, product, headers }),
        );
        const unsubscribe = AISummariesStore.get(url)?.subscribe(setState);
        return () => unsubscribe && unsubscribe();
      }
    }
  }, [isSummarisedOnMount, url, baseUrl, product, headers]);

  const summariseUrl = () => {
    return AISummariesStore.get(url)?.summariseUrl();
  };

  return { isSummarisedOnMount, summariseUrl, state };
};
