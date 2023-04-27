import React, { useCallback } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../../common/constants';
import createEventPayload from '../../common/utils/analytics/analytics.codegen';

import {
  BaseErrorBoundary,
  ErrorBoundaryErrorInfo,
} from './error-boundary-base';
import { ErrorBoundaryUI } from './error-boundary-ui';

export const ErrorBoundary: React.FC<{}> = ({ children }) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();
  const handleError = useCallback(
    (error: Error, info?: ErrorBoundaryErrorInfo) => {
      // Fire Analytics event
      createAnalyticsEvent(
        createEventPayload('operational.linkCreate.unhandledErrorCaught', {
          browserInfo: window?.navigator?.userAgent || 'unknown',
          error: error.toString(),
          componentStack: info?.componentStack ?? '',
        }),
      ).fire(ANALYTICS_CHANNEL);

      // Fire UFO failed experience
      // failUfoExperience(ufoExperience.mounted);
    },
    [createAnalyticsEvent],
  );

  return (
    <BaseErrorBoundary onError={handleError} ErrorComponent={ErrorBoundaryUI}>
      {children}
    </BaseErrorBoundary>
  );
};
