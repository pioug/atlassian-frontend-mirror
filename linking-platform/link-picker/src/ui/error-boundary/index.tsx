import React, { type ErrorInfo, type ReactNode, useCallback } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { failUfoExperience, ufoExperience } from '../../common/analytics/experiences';
import { ANALYTICS_CHANNEL } from '../../common/constants';
import createEventPayload from '../../common/utils/analytics/analytics.codegen';
import { useLinkPickerSessionId } from '../../controllers/session-provider';

import { BaseErrorBoundary } from './error-boundary-base';
import { ErrorBoundaryFallback } from './error-boundary-fallback';

interface ErrorBoundaryProps {
	children: ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const linkPickerSessionId = useLinkPickerSessionId();

	const handleError = useCallback(
		(error: Error, info?: ErrorInfo) => {
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
		<BaseErrorBoundary onError={handleError} ErrorComponent={ErrorBoundaryFallback}>
			{children}
		</BaseErrorBoundary>
	);
}
