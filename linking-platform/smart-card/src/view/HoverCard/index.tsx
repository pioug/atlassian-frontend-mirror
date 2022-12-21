/** @jsx jsx */
import {
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { jsx } from '@emotion/react';
import { FC, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AnalyticsPayload } from '../../../src/utils/types';
import { useSmartLinkAnalytics } from '../../state/analytics';
import { fireSmartLinkEvent } from '../../utils/analytics';
import { HoverCardComponent } from './components/HoverCardComponent';
import { HoverCardProps } from './types';
import { CardDisplay } from '../../constants';

const HoverCardWithErrorBoundary: FC<HoverCardProps> = (props) => {
  const { url, id, children, createAnalyticsEvent } = props;
  const analyticsHandler = useCallback(
    (analyticsPayload: AnalyticsPayload) => {
      fireSmartLinkEvent(analyticsPayload, createAnalyticsEvent);
    },
    [createAnalyticsEvent],
  );
  const analytics = useSmartLinkAnalytics(url, analyticsHandler, id);

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
      <HoverCardComponent
        {...props}
        analyticsHandler={analyticsHandler}
        analytics={analytics}
      >
        {children}
      </HoverCardComponent>
    </ErrorBoundary>
  );
};

export const HoverCard = withAnalyticsContext({
  source: 'smartLinkPreviewHoverCard',
  attributes: {
    display: CardDisplay.HoverCardPreview,
  },
})(withAnalyticsEvents()(HoverCardWithErrorBoundary));
