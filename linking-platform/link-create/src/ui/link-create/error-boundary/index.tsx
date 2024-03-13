import React, { PropsWithChildren, useCallback } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { captureException } from '@atlaskit/linking-common/sentry';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { ANALYTICS_CHANNEL } from '../../../common/constants';
import { ErrorBoundaryUI } from '../../../common/ui/error-boundary-ui';
import createEventPayload from '../../../common/utils/analytics/analytics.codegen';
import { useExperience } from '../../../controllers/experience-tracker';

import {
  BaseErrorBoundary,
  ErrorBoundaryErrorInfo,
} from './error-boundary-base';

type ErrorBoundaryProps = PropsWithChildren<{
  errorComponent?: JSX.Element;
}>;

export const ErrorBoundary = ({
  children,
  errorComponent,
}: ErrorBoundaryProps) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();
  const experience = getBooleanFF(
    'platform.linking-platform.link-create.better-observability',
  )
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useExperience()
    : null;

  const handleError = useCallback(
    (error: Error, info?: ErrorBoundaryErrorInfo) => {
      if (
        !getBooleanFF(
          'platform.linking-platform.link-create.better-observability',
        )
      ) {
        if (
          getBooleanFF(
            'platform.linking-platform.link-create.enable-sentry-client',
          )
        ) {
          // Capture exception to Sentry
          captureException(error, 'link-create');
        }
      }

      createAnalyticsEvent(
        createEventPayload(
          'operational.linkCreate.unhandledErrorCaught',
          getBooleanFF(
            'platform.linking-platform.link-create.enable-sentry-client',
          )
            ? {
                browserInfo: window?.navigator?.userAgent || 'unknown',
                error: error.name,
                componentStack: 'unknown',
              }
            : {
                browserInfo: window?.navigator?.userAgent || 'unknown',
                error: error.toString(),
                componentStack: info?.componentStack ?? '',
              },
        ),
      ).fire(ANALYTICS_CHANNEL);

      if (
        getBooleanFF(
          'platform.linking-platform.link-create.better-observability',
        )
      ) {
        // Track experience as failed for SLO
        experience?.failure(error);
      }
    },
    [createAnalyticsEvent, experience],
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
