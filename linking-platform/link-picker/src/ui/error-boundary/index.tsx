import React, { ReactNode, useCallback } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import createEventPayload from '../../common/utils/analytics/analytics.codegen';
import { ANALYTICS_CHANNEL } from '../../common/constants';
import {
  failUfoExperience,
  ufoExperience,
} from '../../common/analytics/experiences';
import { useLinkPickerSessionId } from '../../controllers/session-provider';

import { ErrorBoundaryFallback } from './error-boundary-fallback';
import {
  BaseErrorBoundary,
  ErrorBoundaryErrorInfo,
} from './error-boundary-base';

interface ErrorBoundaryProps {
  children: ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const { createAnalyticsEvent } = useAnalyticsEvents();
  const linkPickerSessionId = useLinkPickerSessionId();

  const handleError = useCallback(
    (error: Error, info?: ErrorBoundaryErrorInfo) => {
      // Fire Analytics event
      createAnalyticsEvent!(
        createEventPayload('ui.linkPicker.unhandledErrorCaught', {
          browserInfo: window?.navigator?.userAgent || 'unknown',
          error: error.toString(),
          componentStack: info?.componentStack ?? '',
        }),
      ).fire(ANALYTICS_CHANNEL);

      // Fire UFO failed experience
      failUfoExperience(ufoExperience.mounted, linkPickerSessionId);
    },
    [createAnalyticsEvent, linkPickerSessionId],
  );

  return (
    <BaseErrorBoundary
      onError={handleError}
      ErrorComponent={ErrorBoundaryFallback}
    >
      {children}
    </BaseErrorBoundary>
  );
}
