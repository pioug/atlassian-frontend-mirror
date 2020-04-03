import React from 'react';
import { MouseEvent, KeyboardEvent } from 'react';
import LazilyRender from 'react-lazily-render';
import { CardLinkView } from '@atlaskit/media-ui';

import { CardWithUrlContentProps } from './types';
import { uiCardClickedEvent } from '../../utils/analytics';
import { isSpecialEvent } from '../../utils';
import { getDefinitionId, getServices } from '../../state/actions/helpers';
import { BlockCard } from '../BlockCard';
import { InlineCard } from '../InlineCard';
import { useSmartLink } from '../../state';

export function LazyCardWithUrlContent(props: CardWithUrlContentProps) {
  const { appearance, isSelected, container, url, testId } = props;
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
      content={<CardWithUrlContent {...props} />}
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
}: CardWithUrlContentProps) {
  // Get state, actions for this card.
  const { state, actions } = useSmartLink(url, dispatchAnalytics);
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
  // Lazily render into the viewport.
  return appearance === 'inline' ? (
    <InlineCard
      url={url}
      cardState={state}
      handleAuthorize={(services.length && handleAuthorize) || undefined}
      handleFrameClick={handleClickWrapper}
      isSelected={isSelected}
      onResolve={onResolve}
      testId={testId}
    />
  ) : (
    <BlockCard
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
