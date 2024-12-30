import React, { type ErrorInfo, lazy, Suspense, useCallback, useEffect, useState } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { di } from 'react-magnetic-di';
import uuid from 'uuid';

import { useAnalyticsEvents } from '../../common/analytics/generated/use-analytics-events';
import { failUfoExperience, startUfoExperience } from '../../state/analytics';
import { importWithRetry } from '../../utils';
import { useSmartLinkAnalyticsContext } from '../../utils/analytics/SmartLinkAnalyticsContext';
import { isFlexibleUiCard } from '../../utils/flexible';
import { clearMarks, clearMeasures } from '../../utils/performance';
import { type CardProps } from '../Card/types';

import { LoadingCardLink } from './component-lazy/LoadingCardLink';
import { type CardWithUrlContentProps } from './types';

export const LazyCardWithUrlContent = lazy(() =>
	importWithRetry(
		() =>
			import(
				/* webpackChunkName: "@atlaskit-internal_smartcard-urlcardcontent" */ './component-lazy/index'
			),
	),
);

export function CardWithURLRenderer(props: CardProps) {
	di(LazyCardWithUrlContent);
	const [id] = useState(() => (props.id ? props.id : uuid()) satisfies string);
	const { fireEvent } = useAnalyticsEvents();

	useEffect(() => {
		// ComponentWillUnmount
		return () => {
			clearMarks(id);
			clearMeasures(id);
		};
	}, [id]);

	const {
		url,
		appearance,
		isSelected,
		isHovered,
		frameStyle,
		onClick,
		container,
		onResolve,
		onError,
		testId,
		actionOptions,
		inheritDimensions,
		platform,
		embedIframeRef,
		embedIframeUrlType,
		inlinePreloaderStyle,
		children,
		ui,
		showHoverPreview,
		hoverPreviewOptions,
		placeholder,
		fallbackComponent,
		removeTextHighlightingFromTitle,
		resolvingPlaceholder,
		truncateInline,
	} = props;

	const isFlexibleUi = isFlexibleUiCard(children);

	const analyticsContext = useSmartLinkAnalyticsContext({
		display: isFlexibleUi ? 'flexible' : appearance,
		id,
		url: url ?? '',
	});

	const errorHandler = useCallback(
		(error: Error, info: ErrorInfo) => {
			const { componentStack } = info;
			const errorInfo: ErrorInfo = {
				componentStack,
			};
			// NB: APIErrors are thrown in response to Object Resolver Service. We do not
			// fire an event for these, as they do not cover failed UI render events.
			// The rest of the errors caught here are unexpected, and correlate
			// to the reliability of the smart-card front-end components.
			// Likewise, chunk loading errors are not caused by a failure of smart-card rendering.
			if (error.name === 'ChunkLoadError') {
				fireEvent('operational.smartLink.chunkLoadFailed', {
					...analyticsContext?.attributes,
					display: appearance,
					error: error as any,
					errorInfo: errorInfo as any,
					definitionId: null,
				});
			} else if (error.name !== 'APIError') {
				startUfoExperience('smart-link-rendered', id || 'NULL');
				failUfoExperience('smart-link-rendered', id || 'NULL');
				failUfoExperience('smart-link-authenticated', id || 'NULL');
				fireEvent('ui.smartLink.renderFailed', {
					...analyticsContext?.attributes,
					display: isFlexibleUi ? 'flexible' : appearance,
					id: id ?? null,
					error: error as any,
					errorInfo: errorInfo as any,
				});
			}
			onError && onError({ status: 'errored', url: url ?? '', err: error });
		},
		[analyticsContext?.attributes, appearance, fireEvent, id, isFlexibleUi, onError, url],
	);

	if (!url) {
		throw new Error('@atlaskit/smart-card: url property is missing.');
	}

	const defaultFallBackComponent = () => null;
	const FallbackComponent = fallbackComponent ?? defaultFallBackComponent;
	const ErrorFallback = () => <FallbackComponent />;

	const cardWithUrlProps: CardWithUrlContentProps = {
		id,
		url,
		appearance,
		onClick,
		isSelected,
		isHovered,
		frameStyle,
		container,
		onResolve,
		onError,
		testId,
		actionOptions,
		inheritDimensions,
		platform,
		embedIframeRef,
		embedIframeUrlType,
		inlinePreloaderStyle,
		ui,
		showHoverPreview,
		hoverPreviewOptions,
		placeholder,
		removeTextHighlightingFromTitle,
		resolvingPlaceholder,
		truncateInline,
	};

	return (
		<ErrorBoundary FallbackComponent={ErrorFallback} onError={errorHandler}>
			<Suspense fallback={<LoadingCardLink {...cardWithUrlProps} />}>
				<LazyCardWithUrlContent {...cardWithUrlProps}>{children}</LazyCardWithUrlContent>
			</Suspense>
		</ErrorBoundary>
	);
}
