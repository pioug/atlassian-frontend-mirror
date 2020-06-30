import React, { useEffect, useCallback, useState, FC } from 'react';
import { MouseEvent, KeyboardEvent } from 'react';
import LazilyRender from 'react-lazily-render';
import {
  CardLinkView,
  isIntersectionObserverSupported,
} from '@atlaskit/media-ui';

import { CardWithUrlContentProps } from './types';
import { isSpecialEvent } from '../../utils';
import * as measure from '../../utils/performance';
import {
  getDefinitionId,
  getServices,
  isFinalState,
  getClickUrl,
} from '../../state/helpers';
import { useSmartLink } from '../../state';
import { BlockCard } from '../BlockCard';
import { InlineCard } from '../InlineCard';
import { InvokeClientOpts, InvokeServerOpts } from '../../model/invoke-opts';
import { EmbedCard } from '../EmbedCard';

export function LazyCardWithUrlContent(props: CardWithUrlContentProps) {
  const { appearance, container, showActions } = props;
  const offset = Math.ceil(window.innerHeight / 4);
  if (isIntersectionObserverSupported()) {
    return <LazyIntersectionObserverCard {...props} />;
  } else {
    return (
      <LazilyRender
        offset={offset}
        component={appearance === 'inline' ? 'span' : 'div'}
        className="loader-wrapper"
        placeholder={<LoadingCardLink {...props} />}
        scrollContainer={container}
        content={<CardWithUrlContent {...props} showActions={showActions} />}
      />
    );
  }
}

const LoadingCardLink: FC<CardWithUrlContentProps> = ({
  isSelected,
  url,
  testId,
}) => (
  <CardLinkView
    isSelected={isSelected}
    key={'lazy-render-placeholder'}
    link={url}
    testId={testId}
  />
);

export function LazyIntersectionObserverCard(props: CardWithUrlContentProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const { showActions, appearance } = props;

  const Component = appearance === 'inline' ? 'span' : 'div';
  const ComponentObserver = Component;

  const onIntersection: IntersectionObserverCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.disconnect();
      }
    });
  };
  const onRef = useCallback((element: HTMLElement | null) => {
    if (!element) {
      return;
    }
    const intersectionObserver = new IntersectionObserver(onIntersection);
    intersectionObserver.observe(element);
    return () => intersectionObserver.disconnect();
  }, []);

  const content = isIntersecting ? (
    <CardWithUrlContent {...props} showActions={showActions} />
  ) : (
    <ComponentObserver ref={onRef}>
      <LoadingCardLink {...props} />
    </ComponentObserver>
  );
  return <Component className="loader-wrapper">{content}</Component>;
}

export function CardWithUrlContent({
  id,
  url,
  isSelected,
  isFrameVisible,
  platform,
  onClick,
  appearance,
  dispatchAnalytics,
  onResolve,
  testId,
  showActions,
  inheritDimensions,
}: CardWithUrlContentProps) {
  // Get state, actions for this card.
  const { state, actions, config, analytics } = useSmartLink(
    id,
    url,
    dispatchAnalytics,
  );
  const definitionId = getDefinitionId(state.details);
  const services = getServices(state.details);

  // Setup UI handlers.
  const handleClick = useCallback(
    (event: MouseEvent | KeyboardEvent) => {
      const clickUrl = getClickUrl(url, state.details);
      isSpecialEvent(event)
        ? window.open(clickUrl, '_blank')
        : window.open(clickUrl, '_self');
    },
    [state.details, url],
  );
  const handleClickWrapper = useCallback(
    (event: MouseEvent | KeyboardEvent) => {
      if (state.status === 'resolved') {
        analytics.ui.cardClickedEvent(appearance, definitionId);
      }
      onClick ? onClick(event) : handleClick(event);
    },
    [
      state.status,
      analytics.ui,
      appearance,
      definitionId,
      onClick,
      handleClick,
    ],
  );
  const handleAuthorize = useCallback(() => actions.authorize(appearance), [
    actions,
    appearance,
  ]);
  const handleRetry = useCallback(() => {
    actions.reload();
  }, [actions]);
  const handleInvoke = useCallback(
    (opts: InvokeClientOpts | InvokeServerOpts) =>
      actions.invoke(opts, appearance),
    [actions, appearance],
  );

  // NB: for each status change in a Smart Link, a performance mark is created.
  // Measures are sent relative to the first mark, matching what a user sees.
  useEffect(() => {
    measure.mark(id, state.status);
    if (state.status !== 'pending') {
      measure.create(id, state.status);
      analytics.operational.instrument(
        id,
        state.status,
        definitionId,
        state.error,
      );
    }
  }, [
    id,
    appearance,
    state.status,
    state.error,
    definitionId,
    analytics.operational,
  ]);

  // NB: once the smart-card has rendered into an end state, we capture
  // this as a successful render. These can be one of:
  // - the resolved state: when metadata is shown;
  // - the unresolved states: viz. forbidden, not_found, unauthorized, errored.
  useEffect(() => {
    if (isFinalState(state.status)) {
      analytics.ui.renderSuccessEvent(appearance, definitionId);
    }
  }, [
    appearance,
    state.details,
    state.status,
    url,
    definitionId,
    analytics.ui,
  ]);

  switch (appearance) {
    case 'inline':
      return (
        <InlineCard
          url={url}
          cardState={state}
          handleAuthorize={(services.length && handleAuthorize) || undefined}
          handleFrameClick={handleClickWrapper}
          isSelected={isSelected}
          onResolve={onResolve}
          testId={testId}
        />
      );
    case 'block':
      return (
        <BlockCard
          url={url}
          authFlow={config && config.authFlow}
          cardState={state}
          handleAuthorize={(services.length && handleAuthorize) || undefined}
          handleErrorRetry={handleRetry}
          handleInvoke={handleInvoke}
          handleFrameClick={handleClickWrapper}
          handlePreviewAnalytics={dispatchAnalytics}
          isSelected={isSelected}
          onResolve={onResolve}
          testId={testId}
          showActions={showActions}
        />
      );
    case 'embed':
      return (
        <EmbedCard
          url={url}
          cardState={state}
          handleAuthorize={(services.length && handleAuthorize) || undefined}
          handleErrorRetry={handleRetry}
          handleFrameClick={handleClickWrapper}
          handleInvoke={handleInvoke}
          handleAnalytics={dispatchAnalytics}
          isSelected={isSelected}
          isFrameVisible={isFrameVisible}
          platform={platform}
          onResolve={onResolve}
          testId={testId}
          inheritDimensions={inheritDimensions}
          showActions={showActions}
        />
      );
  }
}
