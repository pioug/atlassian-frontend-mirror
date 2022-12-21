import React, { useEffect, useCallback, useMemo } from 'react';
import { MouseEvent, KeyboardEvent } from 'react';

import { useFeatureFlag } from '@atlaskit/link-provider';
import { CardWithUrlContentProps } from './types';
import { isSpecialEvent } from '../../utils';
import * as measure from '../../utils/performance';
import {
  getDefinitionId,
  getServices,
  isFinalState,
  getClickUrl,
  getResourceType,
  getExtensionKey,
  getSubproduct,
  getProduct,
} from '../../state/helpers';
import { useSmartLink } from '../../state';
import { BlockCard } from '../BlockCard';
import { InlineCard } from '../InlineCard';
import { InvokeClientOpts, InvokeServerOpts } from '../../model/invoke-opts';
import { EmbedCard } from '../EmbedCard';
import { isFlexibleUiCard } from '../../utils/flexible';
import FlexibleCard from '../FlexibleCard';
import { APIError } from '../..';
import { CardDisplay } from '../../constants';

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
  onError,
  testId,
  showActions,
  inheritDimensions,
  embedIframeRef,
  inlinePreloaderStyle,
  ui,
  children,
  showHoverPreview,
  analyticsEvents,
}: CardWithUrlContentProps) {
  // Get state, actions for this card.
  const {
    state,
    actions,
    analytics: defaultAnalytics,
    config,
    renderers,
    error,
  } = useSmartLink(id, url, dispatchAnalytics);
  const analytics = analyticsEvents || defaultAnalytics;
  const definitionId = getDefinitionId(state.details);
  const extensionKey = getExtensionKey(state.details);
  const resourceType = getResourceType(state.details);
  const product = getProduct(state.details);
  const subproduct = getSubproduct(state.details);
  const services = getServices(state.details);

  let isFlexibleUi = useMemo(() => isFlexibleUiCard(children), [children]);

  const showHoverPreviewFlag = useFeatureFlag('showHoverPreview');
  if (showHoverPreview === undefined && showHoverPreviewFlag !== undefined) {
    showHoverPreview = Boolean(showHoverPreviewFlag);
  }

  const showAuthTooltipValue = useFeatureFlag('showAuthTooltip');
  const showAuthTooltip =
    !!showAuthTooltipValue && showAuthTooltipValue === 'experiment';

  const enableFlexibleBlockCardFlag = Boolean(
    useFeatureFlag('enableFlexibleBlockCard'),
  );

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
      const isModifierKeyPressed = isSpecialEvent(event);
      analytics.ui.cardClickedEvent({
        id,
        display: isFlexibleUi ? CardDisplay.Flexible : appearance,
        status: state.status,
        definitionId,
        extensionKey,
        isModifierKeyPressed,
        destinationProduct: product,
        destinationSubproduct: subproduct,
      });
      if (onClick) {
        onClick(event);
      } else if (!isFlexibleUi) {
        handleClick(event);
      }
    },
    [
      id,
      state.status,
      analytics.ui,
      appearance,
      definitionId,
      extensionKey,
      onClick,
      handleClick,
      isFlexibleUi,
      product,
      subproduct,
    ],
  );
  const handleAuthorize = useCallback(
    () => actions.authorize(appearance),
    [actions, appearance],
  );
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
    if (state.status !== 'pending' && state.status !== 'resolving') {
      measure.create(id, state.status);
      analytics.operational.instrument({
        id,
        status: state.status,
        definitionId,
        extensionKey,
        resourceType,
        error: state.error,
      });
    }
  }, [
    id,
    appearance,
    state.status,
    state.error,
    definitionId,
    extensionKey,
    resourceType,
    analytics.operational,
  ]);

  // NB: once the smart-card has rendered into an end state, we capture
  // this as a successful render. These can be one of:
  // - the resolved state: when metadata is shown;
  // - the unresolved states: viz. forbidden, not_found, unauthorized, errored.
  useEffect(() => {
    if (isFinalState(state.status)) {
      analytics.ui.renderSuccessEvent({
        display: appearance,
        status: state.status,
        id,
        definitionId,
        extensionKey,
      });
    }
  }, [
    appearance,
    state.status,
    url,
    definitionId,
    extensionKey,
    analytics.ui,
    id,
  ]);

  if (isFlexibleUi) {
    let cardState = state;
    if (error) {
      if (error?.constructor === APIError) {
        cardState = { status: 'errored' };
      } else {
        throw error;
      }
    }

    return (
      <FlexibleCard
        id={id}
        cardState={cardState}
        onAuthorize={(services.length && handleAuthorize) || undefined}
        onClick={handleClickWrapper}
        renderers={renderers}
        ui={ui}
        url={url}
        testId={testId}
        onResolve={onResolve}
        onError={onError}
      >
        {children}
      </FlexibleCard>
    );
  }

  // We have to keep this last to prevent hook order from being violated
  if (error) {
    throw error;
  }

  switch (appearance) {
    case 'inline':
      return (
        <InlineCard
          id={id}
          url={url}
          renderers={renderers}
          cardState={state}
          handleAuthorize={(services.length && handleAuthorize) || undefined}
          handleFrameClick={handleClickWrapper}
          isSelected={isSelected}
          onResolve={onResolve}
          onError={onError}
          testId={testId}
          inlinePreloaderStyle={inlinePreloaderStyle}
          showHoverPreview={showHoverPreview}
          showAuthTooltip={showAuthTooltip}
        />
      );
    case 'block':
      return (
        <BlockCard
          id={id}
          url={url}
          renderers={renderers}
          authFlow={config && config.authFlow}
          cardState={state}
          handleAuthorize={(services.length && handleAuthorize) || undefined}
          handleErrorRetry={handleRetry}
          handleInvoke={handleInvoke}
          handleFrameClick={handleClickWrapper}
          analytics={analytics}
          isSelected={isSelected}
          onResolve={onResolve}
          onError={onError}
          testId={testId}
          showActions={showActions}
          platform={platform}
          enableFlexibleBlockCard={enableFlexibleBlockCardFlag}
        />
      );
    case 'embed':
      return (
        <EmbedCard
          id={id}
          url={url}
          cardState={state}
          handleAuthorize={(services.length && handleAuthorize) || undefined}
          handleErrorRetry={handleRetry}
          handleFrameClick={handleClickWrapper}
          handleInvoke={handleInvoke}
          analytics={analytics}
          isSelected={isSelected}
          isFrameVisible={isFrameVisible}
          platform={platform}
          onResolve={onResolve}
          onError={onError}
          testId={testId}
          inheritDimensions={inheritDimensions}
          showActions={showActions}
          ref={embedIframeRef}
        />
      );
  }
}
