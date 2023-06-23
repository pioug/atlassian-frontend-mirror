/** @jsx jsx */
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { jsx } from '@emotion/react';
import { FC, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSmartLinkAnalytics } from '../../state/analytics';
import { HoverCardComponent } from './components/HoverCardComponent';
import { HoverCardProps } from './types';
import { CardDisplay } from '../../constants';

const HoverCardWithErrorBoundary: FC<HoverCardProps> = (props) => {
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

export const HoverCard = (props: HoverCardProps) => {
  return <HoverCardWithoutAnalyticsContext {...props} />;
};
