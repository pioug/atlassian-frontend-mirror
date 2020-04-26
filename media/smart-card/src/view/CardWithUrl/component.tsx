import React, { useEffect } from 'react';
import { MouseEvent, KeyboardEvent } from 'react';
import LazilyRender from 'react-lazily-render';
import { CardLinkView } from '@atlaskit/media-ui';

import { CardWithUrlContentProps } from './types';
import {
  uiCardClickedEvent,
  uiRenderSuccessEvent,
} from '../../utils/analytics';
import { isSpecialEvent } from '../../utils';
import {
  getDefinitionId,
  getServices,
  isFinalState,
} from '../../state/actions/helpers';
import { BlockCard } from '../BlockCard';
import { InlineCard } from '../InlineCard';
import { useSmartLink } from '../../state';
import { InvokeClientOpts, InvokeServerOpts } from '../../client/types';
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
  url,
  isSelected,
  onClick,
  appearance,
  dispatchAnalytics,
  onResolve,
  testId,
  showActions,
}: CardWithUrlContentProps) {
  // Get state, actions for this card.
  const { state, actions, config } = useSmartLink(url, dispatchAnalytics);
  const services = getServices(state.details);
  // Setup UI handlers.
  const handleClick = (event: MouseEvent | KeyboardEvent) => {
    isSpecialEvent(event)
      ? window.open(url, '_blank')
      : window.open(url, '_self');
  };
  const handleAnalytics = () => {
    const definitionId = getDefinitionId(state.details);
    if (state.status === 'resolved') {
      dispatchAnalytics(uiCardClickedEvent(appearance, definitionId));
    }
  };
  const handleClickWrapper = (event: MouseEvent | KeyboardEvent) => {
    handleAnalytics();
    onClick ? onClick(event) : handleClick(event);
  };
  const handleAuthorize = () => actions.authorize(appearance);
  const handleRetry = () => {
    actions.reload();
  };
  const handleInvoke = (opts: InvokeClientOpts | InvokeServerOpts) =>
    actions.invoke(opts, appearance);

  useEffect(() => {
    if (isFinalState(state.status)) {
      const definitionId = getDefinitionId(state.details);
      dispatchAnalytics(uiRenderSuccessEvent(appearance, definitionId));
    }
  }, [appearance, dispatchAnalytics, state.details, state.status, url]);

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
          onResolve={onResolve}
          testId={testId}
        />
      );
  }
}
