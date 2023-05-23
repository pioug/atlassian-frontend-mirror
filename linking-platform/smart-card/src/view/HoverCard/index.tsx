/** @jsx jsx */
import {
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { jsx } from '@emotion/react';
import { FC, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
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

  /**
   * Feature flag disables prop drilling of analytics handlers
   */
  const analytics = useSmartLinkAnalytics(
    url,
    getBooleanFF(
      'platform.linking-platform.smart-card.refactor-hover-card-analytics',
    )
      ? undefined
      : analyticsHandler,
    id,
  );

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

  /**
   * Feature flag disables the prop drilling of analytics handlers to hover card component
   */
  const analyticsProps = getBooleanFF(
    'platform.linking-platform.smart-card.refactor-hover-card-analytics',
  )
    ? {}
    : {
        analyticsHandler,
        analytics,
      };

  return (
    <ErrorBoundary fallback={children} onError={onError}>
      <HoverCardComponent {...props} {...analyticsProps}>
        {children}
      </HoverCardComponent>
    </ErrorBoundary>
  );
};

const HoverCardWithAnalyticsContext = withAnalyticsContext({
  source: 'smartLinkPreviewHoverCard',
  attributes: {
    display: CardDisplay.HoverCardPreview,
  },
})(withAnalyticsEvents()(HoverCardWithErrorBoundary));

const HoverCardWithoutAnalyticsContext = withAnalyticsEvents()(
  HoverCardWithErrorBoundary,
);

export const HoverCard = (props: HoverCardProps) => {
  if (
    getBooleanFF(
      'platform.linking-platform.smart-card.refactor-hover-card-analytics',
    )
  ) {
    return <HoverCardWithoutAnalyticsContext {...props} />;
  }
  return <HoverCardWithAnalyticsContext {...props} />;
};
