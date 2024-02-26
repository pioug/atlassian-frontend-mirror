import { useState, useEffect } from 'react';
import { AISummariesStore } from './ai-summary-service/store';
import { AISummaryService } from './ai-summary-service';
import type {
  AISummaryServiceProps,
  AISummaryStatus,
} from './ai-summary-service/types';

export const useAISummary = (props: AISummaryServiceProps) => {
  const { url } = props;
  const aISummaryService = AISummariesStore.get(url);
  const isAISummaryServiceInitiated = !!aISummaryService;

  const [state, setState] = useState<{
    status: AISummaryStatus;
    content: string;
  }>(
    isAISummaryServiceInitiated
      ? aISummaryService.state
      : { status: 'ready', content: '' },
  );

  const isSummarised = isAISummaryServiceInitiated && state.status === 'done';

  useEffect(() => {
    if (!isSummarised) {
      if (!isAISummaryServiceInitiated) {
        AISummariesStore.set(url, new AISummaryService(props));
      }
      return AISummariesStore.get(url)?.subscribe(setState);
    }
  }, [isSummarised, isAISummaryServiceInitiated, url, props]);

  const summariseUrl = () => {
    if (isAISummaryServiceInitiated) {
      return aISummaryService.summariseUrl();
    }
    return;
  };

  return { isSummarised, summariseUrl, state };
};
