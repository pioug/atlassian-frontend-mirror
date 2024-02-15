import React, { memo, useCallback, useMemo, useState } from 'react';

import rafSchedule from 'raf-schd';

import { findOverflowScrollParent } from '@atlaskit/editor-common/ui';
import { Card as SmartCard } from '@atlaskit/smart-card';

import { registerCard, registerRemoveOverlay } from '../pm-plugins/actions';
import { AwarenessWrapper } from '../ui/AwarenessWrapper';

import type { SmartCardProps } from './genericCard';

const InlineCard = ({
  node,
  cardContext,
  actionOptions,
  showServerActions,
  useAlternativePreloader,
  view,
  getPos,
  isOverlayEnabled,
  isPulseEnabled,
  pluginInjectionApi,
  isSelected = false,
}: SmartCardProps) => {
  const { url, data } = node.attrs;

  const [isHovered, setIsHovered] = useState(false);
  const [isInserted, setIsInserted] = useState(false);
  const [isResolvedViewRendered, setIsResolvedViewRendered] = useState(false);

  const scrollContainer: HTMLElement | undefined = useMemo(
    () => findOverflowScrollParent(view.dom as HTMLElement) || undefined,
    [view.dom],
  );

  const onResolve = useCallback(
    (data: { url?: string; title?: string }) => {
      if (!getPos || typeof getPos === 'boolean') {
        return;
      }

      const { title, url } = data;
      // don't dispatch immediately since we might be in the middle of
      // rendering a nodeview
      rafSchedule(() => {
        // prosemirror-bump-fix
        const pos = getPos();

        if (typeof pos !== 'number') {
          return;
        }

        const tr = view.state.tr;

        registerCard({
          title,
          url,
          pos,
        })(tr);

        registerRemoveOverlay(() => setIsInserted(false))(tr);

        view.dispatch(tr);
      })();

      if (title) {
        setIsResolvedViewRendered(true);
      }
    },
    [view, getPos],
  );

  const onError = useCallback(
    (data: { url?: string; err?: Error }) => {
      const { url, err } = data;
      if (err) {
        throw err;
      }
      onResolve({ url });
    },
    [onResolve],
  );

  // Begin Upgrade Awareness related code
  const markMostRecentlyInsertedLink = useCallback(
    (isLinkMostRecentlyInserted: boolean) => {
      if (isOverlayEnabled) {
        setIsInserted(isLinkMostRecentlyInserted);
      }
    },
    [isOverlayEnabled],
  );

  const setOverlayHoveredStyles = useCallback(
    (isHovered: boolean) => {
      if (isOverlayEnabled) {
        setIsHovered(isHovered);
      }
    },
    [isOverlayEnabled],
  );
  //  End Upgrade Awareness related code

  const innerCard = useMemo(
    () => (
      <SmartCard
        key={url}
        url={url}
        data={data}
        appearance="inline"
        onClick={() => {}}
        container={scrollContainer}
        onResolve={onResolve}
        onError={onError}
        inlinePreloaderStyle={
          useAlternativePreloader ? 'on-right-without-skeleton' : undefined
        }
        actionOptions={actionOptions}
        showServerActions={showServerActions}
        isHovered={isHovered}
      />
    ),
    [
      data,
      isHovered,
      onError,
      onResolve,
      scrollContainer,
      url,
      useAlternativePreloader,
      actionOptions,
      showServerActions,
    ],
  );

  const card = useMemo(() => {
    return isOverlayEnabled || isPulseEnabled ? (
      <AwarenessWrapper
        isOverlayEnabled={isOverlayEnabled}
        isPulseEnabled={isPulseEnabled}
        cardContext={cardContext}
        getPos={getPos}
        isHovered={isHovered}
        isInserted={isInserted}
        url={url}
        isSelected={isSelected}
        isResolvedViewRendered={isResolvedViewRendered}
        markMostRecentlyInsertedLink={markMostRecentlyInsertedLink}
        pluginInjectionApi={pluginInjectionApi}
        setOverlayHoveredStyles={setOverlayHoveredStyles}
      >
        {innerCard}
      </AwarenessWrapper>
    ) : (
      <span className="card">{innerCard}</span>
    );
  }, [
    cardContext,
    getPos,
    innerCard,
    isHovered,
    isInserted,
    isOverlayEnabled,
    isPulseEnabled,
    isResolvedViewRendered,
    isSelected,
    markMostRecentlyInsertedLink,
    pluginInjectionApi,
    setOverlayHoveredStyles,
    url,
  ]);

  // [WS-2307]: we only render card wrapped into a Provider when the value is ready,
  // otherwise if we got data, we can render the card directly since it doesn't need the Provider
  return cardContext && cardContext.value ? (
    <cardContext.Provider value={cardContext.value}>
      {card}
    </cardContext.Provider>
  ) : data ? (
    card
  ) : null;
};

export const InlineCardWithAwareness = memo(InlineCard);
