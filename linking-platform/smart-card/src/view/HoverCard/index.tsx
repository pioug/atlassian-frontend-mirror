import React, { type ErrorInfo, useCallback } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { di } from 'react-magnetic-di';

import { withAnalyticsEvents } from '@atlaskit/analytics-next';

import { useAnalyticsEvents } from '../../common/analytics/generated/use-analytics-events';
import { CardDisplay } from '../../constants';
import { failUfoExperience, startUfoExperience } from '../../state/analytics';
import { SmartLinkModalProvider } from '../../state/modal';
import { useSmartLinkAnalyticsContext } from '../../utils/analytics/SmartLinkAnalyticsContext';

import { HOVER_CARD_SOURCE, HoverCardComponent } from './components/HoverCardComponent';
import { type HoverCardInternalProps, type HoverCardProps } from './types';

const HoverCardWithErrorBoundary = (props: HoverCardProps & HoverCardInternalProps) => {
	di(HoverCardComponent);
	const { fireEvent } = useAnalyticsEvents();

	const { url, id, children } = props;

	const analyticsContext = useSmartLinkAnalyticsContext({
		display: CardDisplay.HoverCardPreview,
		id,
		source: HOVER_CARD_SOURCE,
		url,
	});

	const onError = useCallback(
		(error: Error, info: ErrorInfo) => {
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
		},
		[analyticsContext, id, fireEvent],
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
export const HoverCard = (props: HoverCardProps & HoverCardInternalProps): React.JSX.Element => {
	return <HoverCardWithoutAnalyticsContext {...props} />;
};

/**
 * A standalone hover preview component
 */
export const StandaloneHoverCard = (props: HoverCardProps): React.JSX.Element => (
	<HoverCard {...props} />
);
