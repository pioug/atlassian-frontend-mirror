import React, { useCallback } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../../../common/constants';
import { ErrorBoundaryUI } from '../../../common/ui/error-boundary-ui';
import createEventPayload from '../../../common/utils/analytics/analytics.codegen';

import {
  BaseErrorBoundary,
  ErrorBoundaryErrorInfo,
} from './error-boundary-base';

type ErrorBoundaryProps = {
  errorComponent?: JSX.Element;
};

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  errorComponent,
}) => {
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
    <BaseErrorBoundary
      onError={handleError}
      errorComponent={errorComponent ?? <ErrorBoundaryUI />}
    >
      {children}
    </BaseErrorBoundary>
  );
};
