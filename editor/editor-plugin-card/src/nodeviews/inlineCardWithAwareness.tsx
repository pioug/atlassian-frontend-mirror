/** @jsx jsx */
import { memo, useCallback, useMemo, useState } from 'react';

import { css, jsx } from '@emotion/react';
import rafSchedule from 'raf-schd';

import { findOverflowScrollParent } from '@atlaskit/editor-common/ui';
import { Card as SmartCard } from '@atlaskit/smart-card';

import useLinkUpgradeDiscoverability from '../common/hooks/useLinkUpgradeDiscoverability';
import {
  isLocalStorageKeyDiscovered,
  LOCAL_STORAGE_DISCOVERY_KEY_SMART_LINK,
  LOCAL_STORAGE_DISCOVERY_KEY_TOOLBAR,
  markLocalStorageKeyDiscovered,
  ONE_DAY_IN_MILLISECONDS,
} from '../common/local-storage';
import { DiscoveryPulse } from '../common/pulse';
import { registerCard } from '../pm-plugins/actions';
import InlineCardOverlay from '../ui/InlineCardOverlay';

import type { SmartCardProps } from './genericCard';

// editor adds a standard line-height that is bigger than an inline smart link
// due to that the link has a bit of white space around it, which doesn't look right when there is pulse around it
const loaderWrapperStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '.loader-wrapper': {
    lineHeight: 'normal',
  },
});

const InlineCard = ({
  node,
  cardContext,
  showServerActions,
  useAlternativePreloader,
  view,
  getPos,
  isOverlayEnabled,
  isPulseEnabled,
  pluginInjectionApi,
  isSelected,
}: SmartCardProps) => {
  const { url, data } = node.attrs;

  // A complete show/hide logic for the overlay will be implemented
  // in EDM-8239 and EDM-8241
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const linkPosition = useMemo(() => {
    if (!getPos || typeof getPos === 'boolean') {
      return undefined;
    }

    const pos = getPos();

    return typeof pos === 'number' ? pos : undefined;
  }, [getPos]);

  const { shouldShowLinkPulse, shouldShowToolbarPulse, shouldShowLinkOverlay } =
    useLinkUpgradeDiscoverability({
      url,
      linkPosition: linkPosition || -1,
      cardContext: cardContext?.value,
      pluginInjectionApi,
      isOverlayEnabled,
      isPulseEnabled,
    });

  // If the toolbar pulse has not yet been invalidated and this is a case where we will be showing it,
  // we need to invalidate the link pulse too. Toolbar pulse will be invalidated in the corresponding component.
  if (
    isSelected &&
    shouldShowToolbarPulse &&
    !isLocalStorageKeyDiscovered(LOCAL_STORAGE_DISCOVERY_KEY_TOOLBAR)
  ) {
    markLocalStorageKeyDiscovered(LOCAL_STORAGE_DISCOVERY_KEY_SMART_LINK);
  }

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

        view.dispatch(
          registerCard({
            title,
            url,
            pos,
          })(view.state.tr),
        );
      })();
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

  const innerCard = useMemo(
    () => (
      <InlineCardOverlay isVisible={isOverlayVisible} url={url}>
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
          showServerActions={showServerActions}
        />
      </InlineCardOverlay>
    ),
    [
      data,
      isOverlayVisible,
      onError,
      onResolve,
      scrollContainer,
      showServerActions,
      url,
      useAlternativePreloader,
    ],
  );

  const card = useMemo(
    () => (
      <span
        css={shouldShowLinkPulse && loaderWrapperStyles}
        className="card"
        {...(shouldShowLinkOverlay
          ? {
              onMouseEnter: () => setIsOverlayVisible(true),
              onMouseLeave: () => setIsOverlayVisible(false),
            }
          : {})}
      >
        {shouldShowLinkPulse ? (
          <DiscoveryPulse
            localStorageKey={LOCAL_STORAGE_DISCOVERY_KEY_SMART_LINK}
            localStorageKeyExpirationInMs={ONE_DAY_IN_MILLISECONDS}
            discoveryMode={'start'}
          >
            {innerCard}
          </DiscoveryPulse>
        ) : (
          innerCard
        )}
      </span>
    ),
    [shouldShowLinkPulse, shouldShowLinkOverlay, innerCard],
  );

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
