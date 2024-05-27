import React, {
  type ErrorInfo,
  lazy,
  useEffect,
  useState,
  Suspense,
  useCallback,
} from 'react';
import uuid from 'uuid';

import { type CardProps } from '../Card/types';
import { clearMarks, clearMeasures } from '../../utils/performance';
import { ErrorBoundary } from 'react-error-boundary';
import { useSmartLinkAnalytics } from '../../state/analytics';
import { LoadingCardLink } from './component-lazy/LoadingCardLink';
import { type CardWithUrlContentProps } from './types';
import { importWithRetry } from '../../utils';
import { isFlexibleUiCard } from '../../utils/flexible';

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
    isHovered,
    isFrameVisible,
    frameStyle,
    onClick,
    container,
    onResolve,
    onError,
    testId,
    showActions,
    showServerActions,
    actionOptions,
    inheritDimensions,
    platform,
    embedIframeRef,
    embedIframeUrlType,
    inlinePreloaderStyle,
    children,
    ui,
    showHoverPreview,
    showAuthTooltip,
    analyticsEvents,
    placeholder,
    fallbackComponent,
    useLegacyBlockCard,
  } = props;

  const analytics = useSmartLinkAnalytics(url ?? '', undefined, id);
  const isFlexibleUi = isFlexibleUiCard(children);
  const errorHandler = useCallback(
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
          display: isFlexibleUi ? 'flexible' : appearance,
          id,
          error,
          errorInfo,
        });
      }

      onError && onError({ status: 'errored', url: url ?? '', err: error });
    },
    [
      analytics.operational,
      analytics.ui,
      appearance,
      id,
      onError,
      url,
      isFlexibleUi,
    ],
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
    isFrameVisible,
    frameStyle,
    container,
    onResolve,
    onError,
    testId,
    showActions,
    showServerActions,
    actionOptions,
    inheritDimensions,
    platform,
    embedIframeRef,
    embedIframeUrlType,
    inlinePreloaderStyle,
    ui,
    showHoverPreview,
    showAuthTooltip,
    analyticsEvents,
    placeholder,
    useLegacyBlockCard,
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={errorHandler}>
      <Suspense fallback={<LoadingCardLink {...cardWithUrlProps} />}>
        <LazyCardWithUrlContent {...cardWithUrlProps}>
          {children}
        </LazyCardWithUrlContent>
      </Suspense>
    </ErrorBoundary>
  );
}
