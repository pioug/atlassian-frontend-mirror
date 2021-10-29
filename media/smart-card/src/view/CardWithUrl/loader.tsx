import React, { ErrorInfo, lazy, useEffect, useState, Suspense } from 'react';
import uuid from 'uuid';

import { CardLinkView } from '@atlaskit/media-ui';

import { CardProps } from '../Card/types';
import { uiRenderFailedEvent, fireSmartLinkEvent } from '../../utils/analytics';
import { AnalyticsPayload } from '../../utils/types';
import { clearMarks, clearMeasures } from '../../utils/performance';
import { ErrorBoundary } from 'react-error-boundary';
import {
  failUfoExperience,
  startUfoExperience,
} from '../../state/analytics/ufoExperiences';

const LazyCardWithUrlContent = lazy(
  () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_smartcard-urlcardcontent" */ './component-lazy/index'
    ),
);

export function CardWithURLRenderer(props: CardProps) {
  const [id] = useState(() => uuid());
  // Equivalent to ComponentWillMount
  useState(() => {
    // We want to start timing of render event only once and right at the start
    startUfoExperience('smart-link-rendered', id);
  });

  useEffect(() => {
    // ComponentWillUnmount
    return () => {
      clearMarks(id);
      clearMeasures(id);
    };
  }, [id]);

  const logError = (
    error: Error,
    info: {
      componentStack: string;
    },
  ) => {
    const { componentStack } = info;
    // NB: APIErrors are thrown in response to Object Resolver Service.
    // In these cases, control is handed back to the Editor. We do not
    // fire an event for these, as they do not cover failed UI render events.
    if (error.name === 'APIError') {
      throw error;
    }
    // NB: the rest of the errors caught here are unexpected, and correlate
    // to the reliability of the smart-card front-end components. We instrument
    // these in order to measure our front-end reliability.
    else {
      const errorInfo: ErrorInfo = {
        componentStack,
      };
      failUfoExperience('smart-link-rendered', id);
      failUfoExperience('smart-link-authenticated', id);
      dispatchAnalytics(uiRenderFailedEvent(appearance, error, errorInfo));
    }
  };

  // Wrapper around analytics.
  const dispatchAnalytics = (analyticsPayload: AnalyticsPayload) => {
    const { appearance, createAnalyticsEvent } = props;
    if (analyticsPayload && analyticsPayload.attributes) {
      // Update if we haven't already set the display - possible
      // in the case of `preview` which is rendered differently.
      if (!analyticsPayload.attributes.display) {
        analyticsPayload.attributes.display = appearance;
      }
    }
    fireSmartLinkEvent(analyticsPayload, createAnalyticsEvent);
  };

  const {
    url,
    appearance,
    isSelected,
    isFrameVisible,
    onClick,
    container,
    onResolve,
    testId,
    showActions,
    inheritDimensions,
    platform,
    embedIframeRef,
    inlinePreloaderStyle,
  } = props;

  if (!url) {
    throw new Error('@atlaskit/smart-card: url property is missing.');
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
      <Suspense
        fallback={<CardLinkView key={'chunk-placeholder'} link={url} />}
      >
        <LazyCardWithUrlContent
          id={id}
          url={url}
          appearance={appearance}
          onClick={onClick}
          isSelected={isSelected}
          isFrameVisible={isFrameVisible}
          dispatchAnalytics={dispatchAnalytics}
          container={container}
          onResolve={onResolve}
          testId={testId}
          showActions={showActions}
          inheritDimensions={inheritDimensions}
          platform={platform}
          embedIframeRef={embedIframeRef}
          inlinePreloaderStyle={inlinePreloaderStyle}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

const ErrorFallback = (): React.ReactElement => {
  return <span />;
};
