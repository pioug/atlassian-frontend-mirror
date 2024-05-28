/** @jsx jsx */
import { useCallback, useEffect, useMemo, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import useLinkUpgradeDiscoverability from '../../common/hooks/useLinkUpgradeDiscoverability';
import {
  isLocalStorageKeyDiscovered,
  LOCAL_STORAGE_DISCOVERY_KEY_SMART_LINK,
  LOCAL_STORAGE_DISCOVERY_KEY_TOOLBAR,
  markLocalStorageKeyDiscovered,
  ONE_DAY_IN_MILLISECONDS,
} from '../../common/local-storage';
import type { SmartCardProps } from '../../nodeviews/genericCard';
import { getResolvedAttributesFromStore } from '../../utils';
import InlineCardOverlay from '../InlineCardOverlay';
import LeftIconOverlay from '../LeftIconOverlay';
import { DiscoveryPulse } from '../Pulse';

type AwarenessWrapperProps = {
  isInserted?: boolean;
  isResolvedViewRendered?: boolean;
  children: JSX.Element;
  markMostRecentlyInsertedLink: (isLinkMostRecentlyInserted: boolean) => void;
  setOverlayHoveredStyles: (isHovered: boolean) => void;
  url: string;
} & Partial<SmartCardProps>;

// editor adds a standard line-height that is bigger than an inline smart link
// due to that the link has a bit of white space around it, which doesn't look right when there is pulse around it
const loaderWrapperStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '.loader-wrapper': {
    lineHeight: 'normal',
  },
});

export const AwarenessWrapper = ({
  cardContext,
  children,
  getPos,
  isInserted,
  isOverlayEnabled,
  isSelected,
  isResolvedViewRendered,
  isPulseEnabled,
  markMostRecentlyInsertedLink,
  pluginInjectionApi,
  setOverlayHoveredStyles,
  url,
}: AwarenessWrapperProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const linkPosition = useMemo(() => {
    if (!getPos || typeof getPos === 'boolean') {
      return undefined;
    }

    const pos = getPos();
    return typeof pos === 'number' ? pos : undefined;
  }, [getPos]);

  const {
    shouldShowLinkPulse,
    shouldShowToolbarPulse,
    shouldShowLinkOverlay,
    isLinkMostRecentlyInserted,
  } = useLinkUpgradeDiscoverability({
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

  useEffect(() => {
    if (shouldShowLinkOverlay && isLinkMostRecentlyInserted) {
      markMostRecentlyInsertedLink(true);
    }
  }, [
    isLinkMostRecentlyInserted,
    markMostRecentlyInsertedLink,
    shouldShowLinkOverlay,
  ]);

  const handleOverlayChange = useCallback(
    (isHovered: boolean) => {
      setIsHovered(isHovered);
      setOverlayHoveredStyles(isHovered);
    },
    [setOverlayHoveredStyles],
  );


  const cardWithOverlay = useMemo(
    () => {
      if (shouldShowLinkOverlay) {
        if (getBooleanFF('platform.linking-platform.smart-links-in-live-pages')) {
          return <LeftIconOverlay
            isSelected={isSelected}
            isVisible={
              isResolvedViewRendered && (isInserted || isHovered || isSelected)
            }
            onMouseEnter={() => handleOverlayChange(true)}
            onMouseLeave={() => handleOverlayChange(false)}
          >
            {children}
          </LeftIconOverlay>
        }
        return (
          <InlineCardOverlay
            isSelected={isSelected}
            isVisible={
              isResolvedViewRendered && (isInserted || isHovered || isSelected)
            }
            onMouseEnter={() => handleOverlayChange(true)}
            onMouseLeave={() => handleOverlayChange(false)}
            url={url}
          >
            {children}
          </InlineCardOverlay>
        )
      }
      return children;
    }, [
    shouldShowLinkOverlay,
    isSelected,
    isResolvedViewRendered,
    isInserted,
    isHovered,
    url,
    children,
    handleOverlayChange,
  ],
  );

  return useMemo(
    () => (
      <span css={shouldShowLinkPulse && loaderWrapperStyles} className="card">
        <AnalyticsContext
          data={{
            attributes: getResolvedAttributesFromStore(
              url,
              'inline',
              cardContext?.value?.store,
            ),
          }}
        >
          <DiscoveryPulse
            localStorageKey={LOCAL_STORAGE_DISCOVERY_KEY_SMART_LINK}
            localStorageKeyExpirationInMs={ONE_DAY_IN_MILLISECONDS}
            discoveryMode="start"
            shouldShowPulse={isResolvedViewRendered && shouldShowLinkPulse}
            testId="link-discovery-pulse"
          >
            {cardWithOverlay}
          </DiscoveryPulse>
        </AnalyticsContext>
      </span>
    ),
    [
      shouldShowLinkPulse,
      url,
      cardContext?.value?.store,
      isResolvedViewRendered,
      cardWithOverlay,
    ],
  );
};
