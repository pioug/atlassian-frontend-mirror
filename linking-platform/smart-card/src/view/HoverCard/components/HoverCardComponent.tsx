/** @jsx jsx */
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import Popup from '@atlaskit/popup';
import { jsx } from '@emotion/react';
import React, { FC, useCallback, useMemo, useRef } from 'react';
import { useSmartLinkActions } from '../../../state/hooks-external/useSmartLinkActions';
import { useSmartLinkRenderers } from '../../../state/renderers';
import { useSmartCardState as useLinkState } from '../../../state/store';
import HoverCardContent from '../components/HoverCardContent';
import { CARD_GAP_PX, HOVER_CARD_Z_INDEX } from '../styled';
import { HoverCardComponentProps } from '../types';
import { CardDisplay } from '../../../constants';
import { SmartLinkAnalyticsContext } from '../../../utils/analytics/SmartLinkAnalyticsContext';

const HOVER_CARD_SOURCE = 'smartLinkPreviewHoverCard';

export const HoverCardComponent: FC<HoverCardComponentProps> = ({
  children,
  url,
  id,
  analyticsHandler,
  analytics,
  canOpen = true,
  closeOnChildClick = false,
  hidePreviewButton = false,
  showServerActions = false,
}) => {
  const delay = 300;
  const [isOpen, setIsOpen] = React.useState(false);
  const fadeOutTimeoutId = useRef<ReturnType<typeof setTimeout>>();
  const fadeInTimeoutId = useRef<ReturnType<typeof setTimeout>>();
  const cardOpenTime = useRef<number>();
  const mousePos = useRef<{ x: number; y: number }>();
  const popupOffset = useRef<[number, number]>();
  const parentSpan = useRef<HTMLSpanElement>(null);

  const renderers = useSmartLinkRenderers();
  const linkState = useLinkState(url);
  const linkStatus = linkState.status;
  const hoverDisplay = 'card';
  const invokeMethod = 'mouse_hover';

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
    if (
      getBooleanFF(
        'platform.linking-platform.smart-card.refactor-hover-card-analytics',
      )
    ) {
      /**
       * Defer to inner HoverCardContent to fire this event
       */
    } else {
      //Check its previously open to avoid firing events when moving between the child and hover card components
      if (isOpen === true && cardOpenTime.current) {
        const hoverTime = Date.now() - cardOpenTime.current;
        analytics?.ui.hoverCardDismissedEvent({
          previewDisplay: 'card',
          hoverTime,
          previewInvokeMethod: 'mouse_hover',
          status: linkStatus,
        });
      }
    }
    setIsOpen(false);
  }, [analytics, isOpen, linkStatus]);

  const initHideCard = useCallback(() => {
    if (fadeInTimeoutId.current) {
      clearTimeout(fadeInTimeoutId.current);
    }
    fadeOutTimeoutId.current = setTimeout(() => hideCard(), delay);
  }, [hideCard]);

  const initShowCard = useCallback(
    (event) => {
      if (fadeOutTimeoutId.current) {
        clearTimeout(fadeOutTimeoutId.current);
      }
      //Set mouse position in the case it's not already set by onMouseMove, as in the case of scrolling
      setMousePosition(event);
      fadeInTimeoutId.current = setTimeout(() => {
        if (
          getBooleanFF(
            'platform.linking-platform.smart-card.refactor-hover-card-analytics',
          )
        ) {
          /**
           * Defer to inner HoverCardContent to fire this event
           */
        } else {
          //Check if its previously closed to avoid firing events when moving between the child and hover card components
          if (isOpen === false) {
            cardOpenTime.current = Date.now();
            analytics?.ui.hoverCardViewedEvent({
              previewDisplay: hoverDisplay,
              previewInvokeMethod: invokeMethod,
              status: linkStatus,
            });
          }
        }
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
    },
    [isOpen, setMousePosition, analytics, linkStatus],
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
        ...(getBooleanFF(
          'platform.linking-platform.smart-card.refactor-hover-card-analytics',
        )
          ? {}
          : { analytics }),
      };

      return getBooleanFF(
        'platform.linking-platform.smart-card.enable-analytics-context',
      ) ? (
        <SmartLinkAnalyticsContext
          url={url}
          appearance={CardDisplay.HoverCardPreview}
          id={id}
          source={HOVER_CARD_SOURCE}
        >
          <HoverCardContent {...hoverCardContentProps} />
        </SmartLinkAnalyticsContext>
      ) : (
        <HoverCardContent {...hoverCardContentProps} />
      );
    },
    [
      analytics,
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
          onMouseEnter={initShowCard}
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
