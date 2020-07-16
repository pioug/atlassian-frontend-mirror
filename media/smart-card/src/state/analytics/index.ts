import { AnalyticsHandler } from '../../utils/types';
import { CardInnerAppearance } from '../../view/Card/types';
import {
  uiAuthEvent,
  uiAuthAlternateAccountEvent,
  uiCardClickedEvent,
  uiActionClickedEvent,
  uiClosedAuthEvent,
  uiRenderSuccessEvent,
  uiRenderFailedEvent,
  resolvedEvent,
  unresolvedEvent,
  invokeSucceededEvent,
  invokeFailedEvent,
  connectSucceededEvent,
  connectFailedEvent,
  trackAppAccountConnected,
  screenAuthPopupEvent,
  instrumentEvent,
} from '../../utils/analytics';
import { ErrorInfo, useMemo } from 'react';
import { CardType } from '../store/types';
import { APIError } from '../../client/errors';

export const useSmartLinkAnalytics = (dispatchAnalytics: AnalyticsHandler) => {
  const ui = useMemo(
    () => ({
      authEvent: (display: CardInnerAppearance, definitionId?: string) =>
        dispatchAnalytics(uiAuthEvent(display, definitionId)),
      authAlternateAccountEvent: (
        display: CardInnerAppearance,
        definitionId?: string,
      ) =>
        dispatchAnalytics(uiAuthAlternateAccountEvent(display, definitionId)),
      cardClickedEvent: (display: CardInnerAppearance, definitionId?: string) =>
        dispatchAnalytics(uiCardClickedEvent(display, definitionId)),
      actionClickedEvent: (
        providerKey: string,
        actionType: string,
        display?: CardInnerAppearance,
      ) =>
        dispatchAnalytics(
          uiActionClickedEvent(providerKey, actionType, display),
        ),
      closedAuthEvent: (display: CardInnerAppearance, definitionId?: string) =>
        dispatchAnalytics(uiClosedAuthEvent(display, definitionId)),
      renderSuccessEvent: (
        display: CardInnerAppearance,
        definitionId?: string,
      ) => dispatchAnalytics(uiRenderSuccessEvent(display, definitionId)),
      renderFailedEvent: (
        display: CardInnerAppearance,
        error: Error,
        errorInfo: ErrorInfo,
      ) => dispatchAnalytics(uiRenderFailedEvent(display, error, errorInfo)),
    }),
    [dispatchAnalytics],
  );

  const operational = useMemo(
    () => ({
      resolvedEvent: (
        id: string,
        definitionId?: string,
        resourceType?: string,
      ) => dispatchAnalytics(resolvedEvent(id, definitionId, resourceType)),
      unresolvedEvent: (
        id: string,
        status: string,
        definitionId?: string,
        resourceType?: string,
      ) =>
        dispatchAnalytics(
          unresolvedEvent(id, status, definitionId, resourceType),
        ),
      invokeSucceededEvent: (
        id: string,
        providerKey: string,
        actionType: string,
        display: CardInnerAppearance,
      ) =>
        dispatchAnalytics(
          invokeSucceededEvent(id, providerKey, actionType, display),
        ),
      invokeFailedEvent: (
        id: string,
        providerKey: string,
        actionType: string,
        display: CardInnerAppearance,
        reason: string,
      ) =>
        dispatchAnalytics(
          invokeFailedEvent(id, providerKey, actionType, display, reason),
        ),
      connectSucceededEvent: (definitionId?: string) =>
        dispatchAnalytics(connectSucceededEvent(definitionId)),
      connectFailedEvent: (definitionId?: string, reason?: string) =>
        dispatchAnalytics(connectFailedEvent(definitionId, reason)),
      instrument: (
        id: string,
        status: CardType,
        definitionId?: string,
        resourceType?: string,
        error?: APIError,
      ) =>
        dispatchAnalytics(
          instrumentEvent(id, status, definitionId, resourceType, error),
        ),
    }),
    [dispatchAnalytics],
  );

  const track = useMemo(
    () => ({
      appAccountConnected: (definitionId?: string) =>
        dispatchAnalytics(trackAppAccountConnected(definitionId)),
    }),
    [dispatchAnalytics],
  );

  const screen = useMemo(
    () => ({
      authPopupEvent: (definitionId?: string) =>
        dispatchAnalytics(screenAuthPopupEvent(definitionId)),
    }),
    [dispatchAnalytics],
  );

  return useMemo(() => ({ ui, operational, track, screen }), [
    ui,
    operational,
    track,
    screen,
  ]);
};

export type AnalyticsFacade = ReturnType<typeof useSmartLinkAnalytics>;
