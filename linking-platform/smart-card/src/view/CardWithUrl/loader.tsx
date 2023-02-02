import React, {
  ErrorInfo,
  lazy,
  useEffect,
  useState,
  Suspense,
  useCallback,
} from 'react';
import uuid from 'uuid';

import { CardProps } from '../Card/types';
import { fireSmartLinkEvent } from '../../utils/analytics';
import { AnalyticsPayload } from '../../utils/types';
import { clearMarks, clearMeasures } from '../../utils/performance';
import { ErrorBoundary } from 'react-error-boundary';
import { useSmartLinkAnalytics } from '../../state/analytics';
import { LoadingCardLink } from './component-lazy/LazyFallback';
import { CardWithUrlContentProps } from './types';
import { importWithRetry } from '../../utils';

const LazyCardWithUrlContent = lazy(() =>
  importWithRetry(
    () =>
      import(
        /* webpackChunkName: "@atlaskit-internal_smartcard-urlcardcontent" */ './component-lazy/index'
      ),
  ),
);

export function CardWithURLRenderer(props: CardProps) {
  const [id] = useState(() => (props.id ? props.id : uuid()));

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
    isFrameVisible,
    onClick,
    container,
    onResolve,
    onError,
    testId,
    showActions,
    inheritDimensions,
    platform,
    embedIframeRef,
    inlinePreloaderStyle,
    createAnalyticsEvent,
    children,
    ui,
    showHoverPreview,
    showAuthTooltip,
    analyticsEvents,
    placeholder,
  } = props;

  // Wrapper around analytics.
  const dispatchAnalytics = useCallback(
    (analyticsPayload: AnalyticsPayload) => {
      if (analyticsPayload && analyticsPayload.attributes) {
        // Update if we haven't already set the display - possible
        // in the case of `preview` which is rendered differently.
        if (!analyticsPayload.attributes.display) {
          analyticsPayload.attributes.display = appearance;
        }
      }
      fireSmartLinkEvent(analyticsPayload, createAnalyticsEvent);
    },
    [appearance, createAnalyticsEvent],
  );

  const analytics = useSmartLinkAnalytics(url ?? '', dispatchAnalytics, id);

  const logError = useCallback(
    (
      error: Error,
      info: {
        componentStack: string;
      },
    ) => {
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
        analytics.operational.chunkloadFailedEvent({
          display: appearance,
          error,
          errorInfo,
        });
      } else if (error.name !== 'APIError') {
        analytics.ui.renderFailedEvent({
          display: appearance,
          id,
          error,
          errorInfo,
        });
      }

      // Rethrow to hand control to the consumer of Smart-card.
      // In the case of editor this allows the Smart Link to fallback to a blue link.
      throw error;
    },
    [analytics.operational, analytics.ui, appearance, id],
  );

  if (!url) {
    throw new Error('@atlaskit/smart-card: url property is missing.');
  }

  const cardWithUrlProps: CardWithUrlContentProps = {
    id,
    url,
    appearance,
    onClick,
    isSelected,
    isFrameVisible,
    dispatchAnalytics,
    container,
    onResolve,
    onError,
    testId,
    showActions,
    inheritDimensions,
    platform,
    embedIframeRef,
    inlinePreloaderStyle,
    ui,
    showHoverPreview,
    showAuthTooltip,
    analyticsEvents,
    placeholder,
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
      <Suspense fallback={<LoadingCardLink {...cardWithUrlProps} />}>
        <LazyCardWithUrlContent {...cardWithUrlProps}>
          {children}
        </LazyCardWithUrlContent>
      </Suspense>
    </ErrorBoundary>
  );
}

const ErrorFallback = () => {
  return null;
};
