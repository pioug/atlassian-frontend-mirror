import { AnalyticsHandler } from '../../utils/types';
import { CardInnerAppearance } from '../../view/Card/types';
import {
  uiAuthEvent,
  uiAuthAlternateAccountEvent,
  uiCardClickedEvent,
  uiActionClickedEvent,
  uiClosedAuthEvent,
  uiRenderSuccessEvent,
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
import { useMemo } from 'react';
import { CardType } from '../store/types';
import { APIError } from '../../client/errors';
import {
  failUfoExperience,
  startUfoExperience,
  succeedUfoExperience,
} from './ufoExperiences';
import { InvokeType } from '../../model/invoke-opts';

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
        isModifierKeyPressed?: boolean,
      ) =>
        dispatchAnalytics(
          uiCardClickedEvent(
            display,
            definitionId,
            extensionKey,
            isModifierKeyPressed,
          ),
        ),
      actionClickedEvent: (
        id: string,
        extensionKey: string,
        actionType: string,
        display: CardInnerAppearance,
        invokeType: InvokeType,
      ) => {
        startUfoExperience('smart-link-action-invocation', id, {
          actionType,
          display,
          extensionKey,
          invokeType,
        });
        dispatchAnalytics(
          uiActionClickedEvent(extensionKey, actionType, display),
        );
      },
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
        id: string,
        definitionId?: string,
        extensionKey?: string,
      ) => {
        succeedUfoExperience('smart-link-rendered', id, {
          extensionKey,
          display,
        });

        // UFO will disregard this if authentication experience has not yet been started
        succeedUfoExperience('smart-link-authenticated', id, {
          display,
        });

        dispatchAnalytics(
          uiRenderSuccessEvent(display, definitionId, extensionKey),
        );
      },
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
      ) => {
        succeedUfoExperience('smart-link-action-invocation', id);
        dispatchAnalytics(
          invokeSucceededEvent(id, providerKey, actionType, display),
        );
      },
      invokeFailedEvent: (
        id: string,
        providerKey: string,
        actionType: string,
        display: CardInnerAppearance,
        reason: string,
      ) => {
        failUfoExperience('smart-link-action-invocation', id);
        dispatchAnalytics(
          invokeFailedEvent(id, providerKey, actionType, display, reason),
        );
      },
      connectSucceededEvent: (
        id: string,
        definitionId?: string,
        extensionKey?: string,
      ) => {
        startUfoExperience('smart-link-authenticated', id, {
          extensionKey,
          status: 'success',
        });
        dispatchAnalytics(connectSucceededEvent(definitionId, extensionKey));
      },
      connectFailedEvent: (
        id: string,
        definitionId?: string,
        extensionKey?: string,
        status?: string,
      ) => {
        startUfoExperience('smart-link-authenticated', id, {
          extensionKey,
          status,
        });
        dispatchAnalytics(
          connectFailedEvent(definitionId, extensionKey, status),
        );
      },
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
