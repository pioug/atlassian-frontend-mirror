import { useState, useEffect } from 'react';
import { AISummariesStore } from './ai-summary-service/store';
import { AISummaryService } from './ai-summary-service';
import type {
  AISummaryServiceProps,
  AISummaryStatus,
} from './ai-summary-service/types';

export const useAISummary = (props: AISummaryServiceProps) => {
  const { url, baseUrl, headers, product } = props;
  const [state, setState] = useState<{
    status: AISummaryStatus;
    content: string;
  }>(AISummariesStore.get(url)?.state || { status: 'ready', content: '' });

  useEffect(() => {
    if (!AISummariesStore.get(url)) {
      AISummariesStore.set(
        url,
        new AISummaryService({ url, baseUrl, headers, product }),
      );
    }

    //returns function that calls unsubscribe method
    return AISummariesStore.get(url)?.subscribe(setState);
  }, [url, baseUrl, headers, product]);

  const summariseUrl = () => {
    return AISummariesStore.get(url)?.summariseUrl();
  };

  return { summariseUrl, state };
};
