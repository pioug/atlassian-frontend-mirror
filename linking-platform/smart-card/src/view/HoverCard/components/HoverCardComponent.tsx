/** @jsx jsx */
import Popup from '@atlaskit/popup';
import { jsx } from '@emotion/react';
import React, { FC, useCallback, useMemo, useRef, useEffect } from 'react';
import { useSmartLinkActions } from '../../../state/hooks-external/useSmartLinkActions';
import { useSmartLinkRenderers } from '../../../state/renderers';
import { useSmartCardState as useLinkState } from '../../../state/store';
import HoverCardContent from '../components/HoverCardContent';
import { CARD_GAP_PX, HOVER_CARD_Z_INDEX } from '../styled';
import { HoverCardComponentProps } from '../types';
import { CardDisplay } from '../../../constants';
import { SmartLinkAnalyticsContext } from '../../../utils/analytics/SmartLinkAnalyticsContext';
import { useSmartCardActions } from '../../../state/actions';
import { useSmartLinkAnalytics } from '../../../state/analytics';

const HOVER_CARD_SOURCE = 'smartLinkPreviewHoverCard';

export const HoverCardComponent: FC<HoverCardComponentProps> = ({
  children,
  url,
  id = '',
  analyticsHandler,
  canOpen = true,
  closeOnChildClick = false,
  hidePreviewButton = false,
  showServerActions = false,
}) => {
  const delay = 300;
  const resolveDelay = 100;
  const [isOpen, setIsOpen] = React.useState(false);
  const fadeOutTimeoutId = useRef<ReturnType<typeof setTimeout>>();
  const fadeInTimeoutId = useRef<ReturnType<typeof setTimeout>>();
  const resolveTimeOutId = useRef<ReturnType<typeof setTimeout>>();
  const mousePos = useRef<{ x: number; y: number }>();
  const popupOffset = useRef<[number, number]>();
  const parentSpan = useRef<HTMLSpanElement>(null);

  const renderers = useSmartLinkRenderers();
  const linkState = useLinkState(url);
  const analytics = useSmartLinkAnalytics(url, undefined, id);
  const { loadMetadata } = useSmartCardActions(id, url, analytics);

  const setMousePosition = useCallback(
    (event) => {
      if (isOpen) {
        return;
      }
      mousePos.current = { x: event.clientX, y: event.clientY };
    },
    [isOpen],
  );

  const hideCard = useCallback(() => {
    setIsOpen(false);
  }, []);

  const initHideCard = useCallback(() => {
    if (fadeInTimeoutId.current) {
      clearTimeout(fadeInTimeoutId.current);
    }

    if (resolveTimeOutId.current) {
      clearTimeout(resolveTimeOutId.current);
    }
    fadeOutTimeoutId.current = setTimeout(() => hideCard(), delay);
  }, [hideCard]);

  // clearing out the timeouts in order to avoid memory leaks
  // in case the component unmounts before they execute
  useEffect(() => {
    return () => {
      if (fadeOutTimeoutId.current) {
        clearTimeout(fadeOutTimeoutId.current);
      }

      if (fadeInTimeoutId.current) {
        clearTimeout(fadeInTimeoutId.current);
      }

      if (resolveTimeOutId.current) {
        clearTimeout(resolveTimeOutId.current);
      }
    };
  }, []);

  // we want to initiate resolve a bit earlier for standalone cards
  // to minimize the loading state
  const initResolve = useCallback(() => {
    // this check covers both non-SSR (status) & SSR case (metadataStatus)
    const isLinkUnresolved =
      linkState.status === 'pending' || !linkState.metadataStatus;

    if (!resolveTimeOutId.current && isLinkUnresolved) {
      resolveTimeOutId.current = setTimeout(() => {
        loadMetadata();
      }, resolveDelay);
    }
  }, [linkState, loadMetadata]);

  const initShowCard = useCallback(
    (event) => {
      if (fadeOutTimeoutId.current) {
        clearTimeout(fadeOutTimeoutId.current);
      }

      initResolve();
      //Set mouse position in the case it's not already set by onMouseMove, as in the case of scrolling
      setMousePosition(event);
      if (!isOpen) {
        fadeInTimeoutId.current = setTimeout(() => {
          //If these are undefined then popupOffset is undefined and we fallback to default bottom-start placement
          if (parentSpan.current && mousePos.current) {
            const { bottom, left } = parentSpan.current.getBoundingClientRect();
            popupOffset.current = [
              mousePos.current.x - left,
              mousePos.current.y - bottom + CARD_GAP_PX,
            ];
          }
          setIsOpen(true);
        }, delay);
      }
    },
    [initResolve, isOpen, setMousePosition],
  );

  const linkActions = useSmartLinkActions({
    url,
    appearance: CardDisplay.HoverCardPreview,
    analyticsHandler,
    origin: HOVER_CARD_SOURCE,
  });

  const filteredActions = useMemo(() => {
    return hidePreviewButton
      ? linkActions.filter((action) => action.id !== 'preview-content')
      : linkActions;
  }, [hidePreviewButton, linkActions]);

  const onActionClick = useCallback(
    (actionId) => {
      if (actionId === 'preview-content') {
        hideCard();
      }
    },
    [hideCard],
  );

  // Stop hover preview content to propagate event to parent.

  const onChildClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (closeOnChildClick) {
        hideCard();
      }
    },
    [closeOnChildClick, hideCard],
  );

  const content = useCallback(
    ({ update }) => {
      const hoverCardContentProps = {
        onMouseEnter: initShowCard,
        onMouseLeave: initHideCard,
        cardActions: filteredActions,
        cardState: linkState,
        onActionClick,
        onResolve: update,
        renderers,
        showServerActions,
        url,
        id,
      };

      return (
        <SmartLinkAnalyticsContext
          url={url}
          display={CardDisplay.HoverCardPreview}
          id={id}
          source={HOVER_CARD_SOURCE}
        >
          <HoverCardContent {...hoverCardContentProps} />
        </SmartLinkAnalyticsContext>
      );
    },
    [
      initHideCard,
      initShowCard,
      filteredActions,
      linkState,
      onActionClick,
      renderers,
      showServerActions,
      url,
      id,
    ],
  );

  const trigger = useCallback(
    (triggerProps) => (
      <span ref={parentSpan}>
        <span
          {...triggerProps}
          onMouseOver={initShowCard}
          onMouseLeave={initHideCard}
          onMouseMove={setMousePosition}
          onClick={onChildClick}
          data-testid="hover-card-trigger-wrapper"
        >
          {children}
        </span>
      </span>
    ),
    [children, initHideCard, initShowCard, onChildClick, setMousePosition],
  );

  return (
    <Popup
      testId="hover-card"
      isOpen={isOpen && canOpen}
      onClose={hideCard}
      placement="bottom-start"
      offset={popupOffset.current}
      autoFocus={false}
      content={content}
      trigger={trigger}
      zIndex={HOVER_CARD_Z_INDEX}
    />
  );
};
