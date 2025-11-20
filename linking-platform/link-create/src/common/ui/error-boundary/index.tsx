import React, { type PropsWithChildren, useCallback } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../../../common/constants';
import { ErrorBoundaryUI } from '../../../common/ui/error-boundary-ui';
import createEventPayload from '../../../common/utils/analytics/analytics.codegen';
import { useExperience } from '../experience-tracker';

import { BaseErrorBoundary } from './error-boundary-base';

type ErrorBoundaryProps = PropsWithChildren<{
	errorComponent?: JSX.Element;
}>;

export const ErrorBoundary = ({
	children,
	errorComponent,
}: ErrorBoundaryProps): React.JSX.Element => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const experience = useExperience();

	const handleError = useCallback(
		(error: Error) => {
			createAnalyticsEvent(
				createEventPayload('operational.linkCreate.unhandledErrorCaught', {
					browserInfo: window?.navigator?.userAgent || 'unknown',
					error: error.name,
					componentStack: 'unknown',
				}),
			).fire(ANALYTICS_CHANNEL);

			// Track experience as failed for SLO
			experience?.failure(error);
		},
		[createAnalyticsEvent, experience],
	);

	return (
		<BaseErrorBoundary onError={handleError} errorComponent={errorComponent ?? <ErrorBoundaryUI />}>
			{children}
		</BaseErrorBoundary>
	);
};
