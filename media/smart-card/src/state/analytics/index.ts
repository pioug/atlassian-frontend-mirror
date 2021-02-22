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
      authEvent: (
        display: CardInnerAppearance,
        definitionId?: string,
        extensionKey?: string,
      ) => dispatchAnalytics(uiAuthEvent(display, definitionId, extensionKey)),
      authAlternateAccountEvent: (
        display: CardInnerAppearance,
        definitionId?: string,
        extensionKey?: string,
      ) =>
        dispatchAnalytics(
          uiAuthAlternateAccountEvent(display, definitionId, extensionKey),
        ),
      cardClickedEvent: (
        display: CardInnerAppearance,
        definitionId?: string,
        extensionKey?: string,
      ) =>
        dispatchAnalytics(
          uiCardClickedEvent(display, definitionId, extensionKey),
        ),
      actionClickedEvent: (
        providerKey: string,
        actionType: string,
        display?: CardInnerAppearance,
      ) =>
        dispatchAnalytics(
          uiActionClickedEvent(providerKey, actionType, display),
        ),
      closedAuthEvent: (
        display: CardInnerAppearance,
        definitionId?: string,
        extensionKey?: string,
      ) =>
        dispatchAnalytics(
          uiClosedAuthEvent(display, definitionId, extensionKey),
        ),
      renderSuccessEvent: (
        display: CardInnerAppearance,
        definitionId?: string,
        extensionKey?: string,
      ) =>
        dispatchAnalytics(
          uiRenderSuccessEvent(display, definitionId, extensionKey),
        ),
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
        extensionKey?: string,
        resourceType?: string,
      ) =>
        dispatchAnalytics(
          resolvedEvent(id, definitionId, extensionKey, resourceType),
        ),
      unresolvedEvent: (
        id: string,
        status: string,
        definitionId?: string,
        extensionKey?: string,
        resourceType?: string,
      ) =>
        dispatchAnalytics(
          unresolvedEvent(id, status, definitionId, extensionKey, resourceType),
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
      connectSucceededEvent: (definitionId?: string, extensionKey?: string) =>
        dispatchAnalytics(connectSucceededEvent(definitionId, extensionKey)),
      connectFailedEvent: (
        definitionId?: string,
        extensionKey?: string,
        reason?: string,
      ) =>
        dispatchAnalytics(
          connectFailedEvent(definitionId, extensionKey, reason),
        ),
      instrument: (
        id: string,
        status: CardType,
        definitionId?: string,
        extensionKey?: string,
        resourceType?: string,
        error?: APIError,
      ) => {
        const event = instrumentEvent(
          id,
          status,
          definitionId,
          extensionKey,
          resourceType,
          error,
        );
        if (event) {
          dispatchAnalytics(event);
        }
      },
    }),
    [dispatchAnalytics],
  );

  const track = useMemo(
    () => ({
      appAccountConnected: (definitionId?: string, extensionKey?: string) =>
        dispatchAnalytics(trackAppAccountConnected(definitionId, extensionKey)),
    }),
    [dispatchAnalytics],
  );

  const screen = useMemo(
    () => ({
      authPopupEvent: (definitionId?: string, extensionKey?: string) =>
        dispatchAnalytics(screenAuthPopupEvent(definitionId, extensionKey)),
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
