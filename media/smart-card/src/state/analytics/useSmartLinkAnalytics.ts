import { useMemo } from 'react';
import { CardType, APIError, getUrl } from '@atlaskit/linking-common';
import { AnalyticsHandler } from '../../utils/types';
import { CardInnerAppearance } from '../../view/Card/types';
import {
  PreviewDisplay,
  PreviewInvokeMethod,
} from '../../view/HoverCard/types';
import {
  uiAuthEvent,
  uiAuthAlternateAccountEvent,
  uiCardClickedEvent,
  uiActionClickedEvent,
  uiClosedAuthEvent,
  uiRenderSuccessEvent,
  uiHoverCardViewedEvent,
  uiHoverCardDismissedEvent,
  uiHoverCardOpenLinkClickedEvent,
  invokeSucceededEvent,
  invokeFailedEvent,
  connectSucceededEvent,
  connectFailedEvent,
  trackAppAccountConnected,
  screenAuthPopupEvent,
  instrumentEvent,
} from '../../utils/analytics';

import {
  failUfoExperience,
  startUfoExperience,
  succeedUfoExperience,
} from './ufoExperiences';
import { InvokeType } from '../../model/invoke-opts';
import { getDefinitionId, getExtensionKey, getResourceType } from '../helpers';
import { DestinationProduct } from '../../utils/analytics/types';
import { useSmartLinkContext } from '@atlaskit/link-provider';

/**
 * This hook provides usage of Smart Link analytics outside of the Card component.
 * Can be provided to Card via the analyticsEvents prop to change the analytics events.
 * @param url URL of the link
 * @param dispatchAnalytics dispatchAnalytics function
 * @param id fallback id of the events sent if no id is available
 * @param defaultLocation location attribute to be used
 * @returns
 */
export const useSmartLinkAnalytics = (
  url: string,
  dispatchAnalytics: AnalyticsHandler,
  id?: string,
  defaultLocation?: string,
) => {
  const defaultId = id || 'NULL';
  // We don't want to trigger a re-render by using useSmartCardState
  const { store } = useSmartLinkContext();
  const state = getUrl(store, url);

  const extractedDefinitionId = getDefinitionId(state.details);
  const extractedExtensionKey = getExtensionKey(state.details);
  const extractedResourceType = getResourceType(state.details);

  /** Contains all ui analytics events */
  const ui = useMemo(
    () => ({
      /**
       * This fires an event that represents when a user clicks on the authentication
       * call to action with no current authenticated account. (i.e. Connect to Preview).
       * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @returns
       */
      authEvent: (
        display: CardInnerAppearance,
        definitionId: string | undefined = extractedDefinitionId,
        extensionKey: string | undefined = extractedExtensionKey,
      ) => dispatchAnalytics(uiAuthEvent(display, definitionId, extensionKey)),
      /**
       * This fires an event that represents when a user clicks on the authentication
       * call to action with a forbidden authenticated account. (i.e. Try another account).
       * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @returns
       */
      authAlternateAccountEvent: (
        display: CardInnerAppearance,
        definitionId: string | undefined = extractedDefinitionId,
        extensionKey: string | undefined = extractedExtensionKey,
      ) =>
        dispatchAnalytics(
          uiAuthAlternateAccountEvent(display, definitionId, extensionKey),
        ),
      /**
       * This fires an event that represents when a user clicks on a Smart Link.
       * @param id The unique ID for this Smart Link.
       * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @param isModifierKeyPressed Whether a modifier key was pressed when clicking the Smart Link.
       * @param location Where the Smart Link is currently rendered.
       * @param destinationProduct The product the Smart Link is linked to.
       * @returns
       */
      cardClickedEvent: (
        id: string = defaultId,
        display: CardInnerAppearance,
        status: CardType,
        definitionId: string | undefined = extractedDefinitionId,
        extensionKey: string | undefined = extractedExtensionKey,
        isModifierKeyPressed?: boolean,
        location: string | undefined = defaultLocation,
        destinationProduct?: DestinationProduct | string,
      ) =>
        dispatchAnalytics(
          uiCardClickedEvent(
            id,
            display,
            status,
            definitionId,
            extensionKey,
            isModifierKeyPressed,
            location,
            destinationProduct,
          ),
        ),
      /**
       * This fires an event that represents when a user clicks on a Smart Link action.
       * Note: This also starts the UFO smart-link-action-invocation experience.
       * @param id The unique ID for this Smart Link.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @param actionType The type of the action that was clicked, e.g. PreviewAction
       * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
       * @param invokeType Whether the action invoked made a call to a server.
       * @returns
       */
      actionClickedEvent: (
        id: string = defaultId,
        extensionKey: string | undefined = extractedExtensionKey,
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
          uiActionClickedEvent(actionType, extensionKey, display),
        );
      },
      /**
       * This fires an event that represents when a user clicks on a hover preview's "navigate to link" button.
       * https://product-fabric.atlassian.net/wiki/spaces/EM/pages/3206743323/Analytics+Metrics+-+Hover+Previews
       * @param previewDisplay What format the preview is in.
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @param previewInvokeMethod How the preview was triggered.
       */
      hoverCardOpenLinkClickedEvent: (
        previewDisplay: PreviewDisplay,
        definitionId: string | undefined = extractedDefinitionId,
        extensionKey: string | undefined = extractedExtensionKey,
        previewInvokeMethod?: PreviewInvokeMethod,
      ) => {
        dispatchAnalytics(
          uiHoverCardOpenLinkClickedEvent(
            previewDisplay,
            definitionId,
            extensionKey,
            previewInvokeMethod,
          ),
        );
      },
      /**
       * This fires an event that represents when a user closed the authentication window without authenticating after opening it.
       * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @returns
       */
      closedAuthEvent: (
        display: CardInnerAppearance,
        definitionId: string | undefined = extractedDefinitionId,
        extensionKey: string | undefined = extractedExtensionKey,
      ) =>
        dispatchAnalytics(
          uiClosedAuthEvent(display, definitionId, extensionKey),
        ),
      /**
       * This fires an event that represents when a Smart Link was rendered successfully.
       * Note: this fires even if the Smart Link request errored out.
       * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
       * @param id The unique ID for this Smart Link.
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       */
      renderSuccessEvent: (
        display: CardInnerAppearance,
        status: CardType,
        id: string = defaultId,
        definitionId: string | undefined = extractedDefinitionId,
        extensionKey: string | undefined = extractedExtensionKey,
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
          uiRenderSuccessEvent(display, status, definitionId, extensionKey),
        );
      },
      /**
       * This fires an event that represents a hover preview being opened.
       * @param hoverDisplay Whether the hover preview was displayed as a card or embed.
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @param previewInvokeMethod How the preview was triggered.
       * @returns
       */
      hoverCardViewedEvent: (
        previewDisplay: PreviewDisplay,
        definitionId: string | undefined = extractedDefinitionId,
        extensionKey: string | undefined = extractedExtensionKey,
        previewInvokeMethod?: PreviewInvokeMethod,
      ) =>
        dispatchAnalytics(
          uiHoverCardViewedEvent(
            previewDisplay,
            definitionId,
            extensionKey,
            previewInvokeMethod,
          ),
        ),
      /**
       * This fires an event that represents a hover preview being dismissed.
       * @param hoverDisplay Whether the hover preview was displayed as a card or embed.
       * @param hoverTime The duration that the user hovered over a Smart Link before the preview was dismissed.
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @param previewInvokeMethod How the preview was triggered.
       * @returns
       */
      hoverCardDismissedEvent: (
        previewDisplay: PreviewDisplay,
        hoverTime: number,
        definitionId: string | undefined = extractedDefinitionId,
        extensionKey: string | undefined = extractedExtensionKey,
        previewInvokeMethod?: PreviewInvokeMethod,
      ) =>
        dispatchAnalytics(
          uiHoverCardDismissedEvent(
            previewDisplay,
            hoverTime,
            definitionId,
            extensionKey,
            previewInvokeMethod,
          ),
        ),
    }),
    [
      defaultId,
      defaultLocation,
      extractedDefinitionId,
      extractedExtensionKey,
      dispatchAnalytics,
    ],
  );

  /** Contains all operational analytics events */
  const operational = useMemo(
    () => ({
      /**
       * This fires an event that represents an action being successfully invoked.
       * @param id The unique ID for this Smart Link.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @param actionType The type of action invoked, e.g. PreviewAction
       * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
       */
      invokeSucceededEvent: (
        id: string = defaultId,
        extensionKey: string | undefined = extractedExtensionKey,
        actionType: string,
        display: CardInnerAppearance,
      ) => {
        succeedUfoExperience('smart-link-action-invocation', id);
        dispatchAnalytics(
          invokeSucceededEvent(id, actionType, display, extensionKey),
        );
      },
      /**
       * This fires an event that represents an action being unsuccessfully invoked.
       * @param id The unique ID for this Smart Link.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @param actionType The type of action invoked, e.g. PreviewAction
       * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
       * @param reason The reason the invocation failed.
       */
      invokeFailedEvent: (
        id: string = defaultId,
        providerKey: string | undefined = extractedExtensionKey,
        actionType: string,
        display: CardInnerAppearance,
        reason: string,
      ) => {
        failUfoExperience('smart-link-action-invocation', id);
        dispatchAnalytics(
          invokeFailedEvent(id, actionType, display, reason, providerKey),
        );
      },
      /**
       * This fires an event that represents an account successfully being connected via a Smart Link.
       * @param id The unique ID for this Smart Link.
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       */
      connectSucceededEvent: (
        id: string = defaultId,
        definitionId: string | undefined = extractedDefinitionId,
        extensionKey: string | undefined = extractedExtensionKey,
      ) => {
        startUfoExperience('smart-link-authenticated', id, {
          extensionKey,
          status: 'success',
        });
        dispatchAnalytics(connectSucceededEvent(definitionId, extensionKey));
      },
      /**
       * This fires an event that represents an account unsuccessfully being connected.
       * @param id The unique ID for this Smart Link.
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @param reason The reason why the Smart Link connect account failed.
       */
      connectFailedEvent: (
        id: string = defaultId,
        definitionId: string | undefined = extractedDefinitionId,
        extensionKey: string | undefined = extractedExtensionKey,
        reason?: string,
      ) => {
        startUfoExperience('smart-link-authenticated', id, {
          extensionKey,
          status: reason,
        });
        dispatchAnalytics(
          connectFailedEvent(definitionId, extensionKey, reason),
        );
      },
      /**
       * This fires an event which represents a Smart Link request succeeding or failing based on the status.
       * @param id The unique ID for this Smart Link.
       * @param status The status of the Smart Link.
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @param resourceType The type of resource that was invoked. This is provider specific (e.g. File, PullRequest).
       * @param error An error representing why the Smart Link request failed.
       */
      instrument: (
        id: string = defaultId,
        status: CardType,
        definitionId: string | undefined = extractedDefinitionId,
        extensionKey: string | undefined = extractedExtensionKey,
        resourceType: string | undefined = extractedResourceType,
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
    [
      defaultId,
      extractedResourceType,
      extractedDefinitionId,
      extractedExtensionKey,
      dispatchAnalytics,
    ],
  );

  /** Contains all track analytics events */
  const track = useMemo(
    () => ({
      /**
       * This fires an event which represents a user starting the Smart Link connect account process.
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @returns
       */
      appAccountConnected: (
        definitionId: string | undefined = extractedDefinitionId,
        extensionKey: string | undefined = extractedExtensionKey,
      ) =>
        dispatchAnalytics(trackAppAccountConnected(definitionId, extensionKey)),
    }),
    [extractedDefinitionId, extractedExtensionKey, dispatchAnalytics],
  );

  /** Contains all screen analytics events */
  const screen = useMemo(
    () => ({
      /**
       * This fires an event which represents the connect account page being opened.
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @returns
       */
      authPopupEvent: (
        definitionId: string | undefined = extractedDefinitionId,
        extensionKey: string | undefined = extractedExtensionKey,
      ) => dispatchAnalytics(screenAuthPopupEvent(definitionId, extensionKey)),
    }),
    [extractedDefinitionId, extractedExtensionKey, dispatchAnalytics],
  );

  return useMemo(() => ({ ui, operational, track, screen }), [
    ui,
    operational,
    track,
    screen,
  ]);
};

export type AnalyticsFacade = ReturnType<typeof useSmartLinkAnalytics>;
