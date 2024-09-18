import { useCallback } from 'react';

import { captureException } from '@atlaskit/linking-common/sentry';
import { getTraceId } from '@atlaskit/linking-common/utils';

import { useDatasourceAnalyticsEvents } from '../analytics';
import { type DatasourceOperationFailedAttributesType } from '../analytics/generated/analytics.types';

const getNetworkFields = (error: unknown) => {
	return error instanceof Response
		? {
				traceId: getTraceId(error),
				status: error.status,
			}
		: { traceId: null, status: null };
};

type Tail<T extends any[]> = T extends [infer A, ...infer R] ? R : never;

/**
 * This function is just a wrapper around captureException that checks if the enable-sentry-client FF is enabled
 * and error is instanceof Error. We have to override the type of error from captureException to unknown so we use
 * a helper Tail type which removes the first element of the tuple
 */
export const logToSentry = (
	error: unknown,
	...captureExceptionParams: Tail<Parameters<typeof captureException>>
) => {
	if (error instanceof Error) {
		captureException(error, ...captureExceptionParams);
	}
};

interface UseErrorLoggerPropsDatasource {
	datasourceId: string;
}

interface UseErrorLoggerPropsActions {
	integrationKey: string;
}

export type UseErrorLoggerProps = UseErrorLoggerPropsDatasource | UseErrorLoggerPropsActions;

const useErrorLogger = (loggerProps: UseErrorLoggerProps) => {
	const { fireEvent } = useDatasourceAnalyticsEvents();

	/**
	 * Sentry is good because it can retrieve name, message, stacktrace of an Error. That's why we will send to Sentry only
	 * if an error is instance of `Error`. Sentry is also capable of some PII scrubbing of these risky fields.
	 *
	 * We will send to Splunk every single time, though, but we won't send PII risky fields.
	 */
	const captureError = useCallback(
		(errorLocation: DatasourceOperationFailedAttributesType['errorLocation'], error: unknown) => {
			const { traceId, status } = getNetworkFields(error);

			fireEvent('operational.datasource.operationFailed', {
				errorLocation,
				traceId,
				status,
			});
			logToSentry(error, 'link-datasource', { ...loggerProps });
		},
		[fireEvent, loggerProps],
	);

	return { captureError };
};

export default useErrorLogger;
