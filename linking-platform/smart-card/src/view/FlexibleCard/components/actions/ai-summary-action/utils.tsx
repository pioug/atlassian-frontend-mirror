import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { type ErrorMessage } from '../../../../../state/hooks/use-ai-summary/ai-summary-service/types';
import { getAISummaryErrorMessage } from '../../../../../utils/ai-summary';
import AIEventErrorViewed from '../../common/ai-summary/ai-event-error-viewed';
import AILearnMoreAnchor from '../../common/ai-summary/ai-learn-more-anchor';
import type { ActionMessage } from '../action/types';

export const getErrorMessage = (error?: ErrorMessage): ActionMessage => {
  const { message, url } = getAISummaryErrorMessage(error);

  return {
    appearance: 'error',
    title: (
      <>
        <AIEventErrorViewed reason={error} />
        <FormattedMessage
          {...message}
          values={{
            a: (chunks: React.ReactNode[]) => (
              <AILearnMoreAnchor href={url}>{chunks}</AILearnMoreAnchor>
            ),
          }}
        />
      </>
    ),
  };
};
