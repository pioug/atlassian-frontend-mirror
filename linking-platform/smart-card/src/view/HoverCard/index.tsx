/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ErrorInfo, useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { ErrorBoundary } from 'react-error-boundary';
import { di } from 'react-magnetic-di';

import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';

import { useAnalyticsEvents } from '../../common/analytics/generated/use-analytics-events';
import { CardDisplay } from '../../constants';
import { useSmartLinkAnalytics } from '../../state';
import { failUfoExperience, startUfoExperience } from '../../state/analytics';
import { SmartLinkModalProvider } from '../../state/modal';
import { useSmartLinkAnalyticsContext } from '../../utils/analytics/SmartLinkAnalyticsContext';

import { HOVER_CARD_SOURCE, HoverCardComponent } from './components/HoverCardComponent';
import { type HoverCardInternalProps, type HoverCardProps } from './types';

const HoverCardWithErrorBoundary = (props: HoverCardProps & HoverCardInternalProps) => {
	di(HoverCardComponent);
	const { fireEvent } = useAnalyticsEvents();

	const { url, id, children } = props;

	const analytics = useSmartLinkAnalytics(url, id);

	const analyticsContext = useSmartLinkAnalyticsContext({
		display: CardDisplay.HoverCardPreview,
		id,
		source: HOVER_CARD_SOURCE,
		url,
	});

	const onError = useCallback(
		(error: Error, info: ErrorInfo) => {
			if (fg('platform-smart-card-migrate-embed-modal-analytics')) {
				startUfoExperience('smart-link-rendered', id || 'NULL');
				failUfoExperience('smart-link-rendered', id || 'NULL');
				failUfoExperience('smart-link-authenticated', id || 'NULL');

				fireEvent('ui.smartLink.renderFailed', {
					...analyticsContext?.attributes,
					display: CardDisplay.HoverCardPreview,
					id: id ?? null,
					error: error as any,
					errorInfo: info as any,
				});
			} else {
				analytics.ui.renderFailedEvent({
					display: CardDisplay.HoverCardPreview,
					id,
					error,
					errorInfo: info,
				});
			}
		},
		[analytics.ui, analyticsContext, id, fireEvent],
	);

	return (
		<ErrorBoundary fallback={children} onError={onError}>
			<SmartLinkModalProvider>
				<HoverCardComponent {...props}>{children}</HoverCardComponent>
			</SmartLinkModalProvider>
		</ErrorBoundary>
	);
};

const HoverCardWithoutAnalyticsContext = withAnalyticsEvents()(HoverCardWithErrorBoundary);

/**
 * A hover preview component using within smart links,
 * e.g. inline card's hover preview and auth tooltip, flexible card's hover preview.
 *
 * This component contains additional props that smart-card internal components
 * use to configure hover preview behaviour.
 */
export const HoverCard = (props: HoverCardProps & HoverCardInternalProps) => {
	return <HoverCardWithoutAnalyticsContext {...props} />;
};

/**
 * A standalone hover preview component
 */
export const StandaloneHoverCard = (props: HoverCardProps) => <HoverCard {...props} />;
