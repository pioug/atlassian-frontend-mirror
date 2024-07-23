/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSmartLinkAnalytics } from '../../state/analytics';
import { SmartLinkModalProvider } from '../../state/modal';
import { HoverCardComponent } from './components/HoverCardComponent';
import { type HoverCardInternalProps, type HoverCardProps } from './types';
import { CardDisplay } from '../../constants';
import { di } from 'react-magnetic-di';

const HoverCardWithErrorBoundary = (props: HoverCardProps & HoverCardInternalProps) => {
	di(HoverCardComponent);

	const { url, id, children } = props;

	const analytics = useSmartLinkAnalytics(url, undefined, id);

	const onError = useCallback(
		(
			error: Error,
			info: {
				componentStack: string;
			},
		) => {
			analytics.ui.renderFailedEvent({
				display: CardDisplay.HoverCardPreview,
				id,
				error,
				errorInfo: info,
			});
		},
		[analytics.ui, id],
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
