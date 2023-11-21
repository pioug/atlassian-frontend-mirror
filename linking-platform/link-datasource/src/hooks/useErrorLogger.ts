import { useCallback } from 'react';

import { captureException } from '@atlaskit/linking-common/sentry';
import { getTraceId } from '@atlaskit/linking-common/utils';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { useDatasourceAnalyticsEvents } from '../analytics';

const getNetworkFields = (error: unknown) => {
  return error instanceof Response
    ? {
        traceId: getTraceId(error),
        status: error.status,
      }
    : { traceId: null, status: null };
};

const useErrorLogger = () => {
  const { fireEvent } = useDatasourceAnalyticsEvents();

  /**
   * Sentry is good because it can retrieve name, message, stacktrace of an Error. That's why we will send to Sentry only
   * if an error is instance of `Error`. Sentry is also capable of some PII scrubbing of these risky fields.
   *
   * We will send to Splunk every single time, though, but we won't send PII risky fields.
   */
  const captureError = useCallback(
    (errorLocation: string, error: unknown) => {
      const { traceId, status } = getNetworkFields(error);

      fireEvent('operational.datasource.operationFailed', {
        errorLocation,
        traceId,
        status,
      });
      if (
        getBooleanFF(
          'platform.linking-platform.datasources.enable-sentry-client',
        ) &&
        error instanceof Error
      ) {
        captureException(error, 'link-datasource');
      }
    },
    [fireEvent],
  );

  return { captureError };
};

export default useErrorLogger;
