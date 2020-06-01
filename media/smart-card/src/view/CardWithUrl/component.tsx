import React, { useEffect } from 'react';
import { MouseEvent, KeyboardEvent } from 'react';
import LazilyRender from 'react-lazily-render';
import { CardLinkView } from '@atlaskit/media-ui';

import { CardWithUrlContentProps } from './types';
import { isSpecialEvent } from '../../utils';
import * as measure from '../../utils/performance';
import {
  getDefinitionId,
  getServices,
  isFinalState,
} from '../../state/helpers';
import { useSmartLink } from '../../state';
import { BlockCard } from '../BlockCard';
import { InlineCard } from '../InlineCard';
import { InvokeClientOpts, InvokeServerOpts } from '../../model/invoke-opts';
import { EmbedCard } from '../EmbedCard';

export function LazyCardWithUrlContent(props: CardWithUrlContentProps) {
  const { appearance, isSelected, container, url, testId, showActions } = props;
  const offset = Math.ceil(window.innerHeight / 4);
  return (
    <LazilyRender
      offset={offset}
      component={appearance === 'inline' ? 'span' : 'div'}
      placeholder={
        <CardLinkView
          isSelected={isSelected}
          key={'lazy-render-placeholder'}
          link={url}
          testId={testId}
        />
      }
      scrollContainer={container}
      content={<CardWithUrlContent {...props} showActions={showActions} />}
    />
  );
}

export function CardWithUrlContent({
  id,
  url,
  isSelected,
  isFrameVisible,
  onClick,
  appearance,
  dispatchAnalytics,
  onResolve,
  testId,
  showActions,
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
  const handleClick = (event: MouseEvent | KeyboardEvent) => {
    isSpecialEvent(event)
      ? window.open(url, '_blank')
      : window.open(url, '_self');
  };
  const handleClickWrapper = (event: MouseEvent | KeyboardEvent) => {
    if (state.status === 'resolved') {
      analytics.ui.cardClickedEvent(appearance, definitionId);
    }
    onClick ? onClick(event) : handleClick(event);
  };
  const handleAuthorize = () => actions.authorize(appearance);
  const handleRetry = () => {
    actions.reload();
  };
  const handleInvoke = (opts: InvokeClientOpts | InvokeServerOpts) =>
    actions.invoke(opts, appearance);

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
          isSelected={isSelected}
          isFrameVisible={isFrameVisible}
          onResolve={onResolve}
          testId={testId}
        />
      );
  }
}
