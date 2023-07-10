/** @jsx jsx */
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { jsx } from '@emotion/react';
import { FC, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSmartLinkAnalytics } from '../../state/analytics';
import { HoverCardComponent } from './components/HoverCardComponent';
import { HoverCardInternalProps, HoverCardProps } from './types';
import { CardDisplay } from '../../constants';

const HoverCardWithErrorBoundary: FC<
  HoverCardProps & HoverCardInternalProps
> = (props) => {
  const { url, id, children } = props;

  const analytics = useSmartLinkAnalytics(url, undefined, id);

  const onError = useCallback(
    (error, info) => {
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
      <HoverCardComponent {...props}>{children}</HoverCardComponent>
    </ErrorBoundary>
  );
};

const HoverCardWithoutAnalyticsContext = withAnalyticsEvents()(
  HoverCardWithErrorBoundary,
);

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
export const StandaloneHoverCard = (props: HoverCardProps) => (
  <HoverCard {...props} />
);
