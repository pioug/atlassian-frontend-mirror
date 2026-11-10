import React, { type ErrorInfo, useCallback } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import { useSmartCardContext } from '@atlaskit/link-provider/use-smart-card-context';
import { getUrl } from '@atlaskit/linking-common/store';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { useAnalyticsEvents } from '../../../common/analytics/generated/use-analytics-events';
import { failUfoExperience } from '../../../state/analytics/failUfoExperience';
import { startUfoExperience } from '../../../state/analytics/startUfoExperience';
import { getSmartLinkAnalyticsContext } from '../../../utils/analytics/getSmartLinkAnalyticsContext';
import type { CardProps } from '../../Card';
import { LoadingCardLink } from '../component-lazy/LoadingCardLink';

type CardErrorBoundaryProps = CardProps & Required<Pick<CardProps, 'id' | 'url'>>;
const CardErrorBoundaryOld = ({
	children,
	...props
}: React.PropsWithChildren<CardErrorBoundaryProps>): React.JSX.Element => {
	// TODO: NAVX-4682: Add feature parity to CardWithURLRenderer
	const ErrorFallbackComponent = props.fallbackComponent;

	const errorBoundaryFallbackComponent = () => {
		if (ErrorFallbackComponent) {
			return <ErrorFallbackComponent />;
		}

		return <LoadingCardLink {...props} />;
	};

	return (
		<ErrorBoundary FallbackComponent={errorBoundaryFallbackComponent}>{children}</ErrorBoundary>
	);
};

type CardErrorBoundaryNewProps = CardErrorBoundaryProps & {
	isFlexibleCard?: boolean;
};
const CardErrorBoundaryNew = ({
	children,
	isFlexibleCard = false,
	...props
}: React.PropsWithChildren<CardErrorBoundaryNewProps>): React.JSX.Element => {
	const { appearance, id, onError, url } = props;
	const ErrorFallbackComponent = props.fallbackComponent;

	const { fireEvent } = useAnalyticsEvents();
	const { value: smartCardContext } = useSmartCardContext();
	const store = smartCardContext?.store;
	const display = isFlexibleCard ? 'flexible' : appearance;

	// Parity with CardWithURLRenderer error handler
	const errorHandler = useCallback(
		(error: Error, info: ErrorInfo) => {
			const { componentStack } = info;
			const errorInfo: ErrorInfo = {
				componentStack,
			};
			// Read the link state when the error happens: useSmartCardContext does not subscribe
			// to store updates, so a value captured during render can be stale by now.
			const state = store ? getUrl(store, url) : undefined;
			const analyticsContext = getSmartLinkAnalyticsContext({
				display,
				id,
				response: state?.details,
				status: state?.status,
				url,
				error: state?.error,
			});
			// NB: APIErrors are thrown in response to Object Resolver Service. We do not
			// fire an event for these, as they do not cover failed UI render events.
			// The rest of the errors caught here are unexpected, and correlate
			// to the reliability of the smart-card front-end components.
			// Likewise, chunk loading errors are not caused by a failure of smart-card rendering.
			if (error.name === 'ChunkLoadError') {
				fireEvent('operational.smartLink.chunkLoadFailed', {
					...analyticsContext?.attributes,
					display,
					error: error as any,
					errorInfo: errorInfo as any,
					definitionId: null,
				});
			} else if (error.name !== 'APIError') {
				startUfoExperience('smart-link-rendered', id, { ssr: true });
				failUfoExperience('smart-link-rendered', id);
				failUfoExperience('smart-link-authenticated', id);
				fireEvent('ui.smartLink.renderFailed', {
					...analyticsContext?.attributes,
					display,
					id,
					error: error as any,
					errorInfo: errorInfo as any,
				});
			}
			onError && onError({ status: 'errored', url, err: error });
		},
		[display, fireEvent, id, onError, store, url],
	);

	const errorBoundaryFallbackComponent = () => {
		if (ErrorFallbackComponent) {
			return <ErrorFallbackComponent />;
		}

		return <LoadingCardLink {...props} />;
	};

	return (
		<ErrorBoundary FallbackComponent={errorBoundaryFallbackComponent} onError={errorHandler}>
			{children}
		</ErrorBoundary>
	);
};

const CardErrorBoundary = ({
	isFlexibleCard,
	...props
}: React.PropsWithChildren<CardErrorBoundaryNewProps>): React.JSX.Element => {
	if (fg('platform_smartlink_cardssr_missing_events')) {
		return <CardErrorBoundaryNew {...props} isFlexibleCard={isFlexibleCard} />;
	}
	return <CardErrorBoundaryOld {...props} />;
};

export default CardErrorBoundary;
