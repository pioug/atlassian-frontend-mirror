import { useMemo } from 'react';
import { getUrl } from '@atlaskit/linking-common';
import {
  AnalyticsHandler,
  AnalyticsName,
  AnalyticsPayload,
} from '../../utils/types';
import {
  chunkloadFailedEvent,
  connectFailedEvent,
  connectSucceededEvent,
  context,
  instrumentEvent,
  invokeFailedEvent,
  invokeSucceededEvent,
  screenAuthPopupEvent,
  trackAppAccountAuthStarted,
  trackAppAccountConnected,
  uiActionClickedEvent,
  uiAuthAlternateAccountEvent,
  uiAuthEvent,
  uiCardClickedEvent,
  uiClosedAuthEvent,
  uiHoverCardDismissedEvent,
  uiHoverCardOpenLinkClickedEvent,
  uiHoverCardViewedEvent,
  uiLearnMoreLinkClickedEvent,
  uiRenderFailedEvent,
  uiRenderSuccessEvent,
  uiSmartLinkStatusLozengeButtonClicked,
  uiSmartLinkStatusListItemButtonClicked,
  uiSmartLinkStatusOpenPreviewButtonClicked,
} from '../../utils/analytics';

import {
  failUfoExperience,
  startUfoExperience,
  succeedUfoExperience,
} from './ufoExperiences';
import {
  getDefinitionId,
  getExtensionKey,
  getProduct,
  getResourceType,
  getStatusDetails,
  getSubproduct,
} from '../helpers';
import {
  CommonEventProps,
  ConnectFailedEventProps,
  ConnectSucceededEventProps,
  InstrumentEventProps,
  InvokeFailedEventProps,
  InvokeSucceededEventProps,
  ScreenAuthPopupEventProps,
  TrackAppAccountConnectedProps,
  UiActionClickedEventProps,
  UiAuthAlternateAccountEventProps,
  UiAuthEventProps,
  UiCardClickedEventProps,
  UiClosedAuthEventProps,
  UiHoverCardDismissedEventProps,
  UiHoverCardOpenLinkClickedEventProps,
  UiHoverCardViewedEventProps,
  UiIframeDwelledEventProps,
  UiIframeFocusedEventProps,
  UiRenderFailedEventProps,
  UiRenderSuccessEventProps,
} from '../../utils/analytics/types';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import {
  trackHoverCardResolutionStarted,
  TrackQuickActionFailureReason,
  TrackQuickActionType,
  trackSmartLinkQuickActionFailed,
  trackSmartLinkQuickActionStarted,
  trackSmartLinkQuickActionSuccess,
  uiIframeDwelledEvent,
  uiIframeFocusedEvent,
} from '../../utils/analytics/analytics';
import { useDispatchAnalytics } from './useDispatchAnalytics';
import { SmartLinkActionType } from '@atlaskit/linking-types';

const applyCommonAttributes = (
  event: AnalyticsPayload,
  commonAttributes: CommonEventProps,
) => {
  if (event && event.attributes) {
    for (const [key, value] of Object.entries(commonAttributes)) {
      if (event.attributes[key] === undefined) {
        event.attributes[key] = value;
      }
    }
  }
  return event;
};

/**
 * This hook provides usage of Smart Link analytics outside of the Card component.
 * Can be provided to Card via the analyticsEvents prop to change the analytics events.
 *
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2681 Internal documentation for deprecation (no external access)}
 * This hook's external use is deprecated and may no longer be exported from this package in future releases.
 * Please avoid using it in conjunction with the `analyticsEvents` prop.
 *
 * @param url URL of the link
 * @param dispatchAnalytics dispatchAnalytics function
 * @param id fallback id of the events sent if no id is available
 * @param defaultLocation location attribute to be used
 * @returns
 */
export const useSmartLinkAnalytics = (
  url: string,
  /**
   * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2681 Internal documentation for deprecation (no external access)}
   * Overriding the analytics dispatch method is deprecated. Please omit this argument.
   */
  _dispatchAnalytics?: AnalyticsHandler,
  /**
   * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2681 Internal documentation for deprecation (no external access)}
   * Provide this via the id prop on the `<Card />` component.
   */
  id?: string,
  /**
   * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2681 Internal documentation for deprecation (no external access)}
   * Provide this attribute via analytics context.
   */
  defaultLocation?: string,
) => {
  const { dispatchAnalytics } = useDispatchAnalytics(_dispatchAnalytics);

  const defaultId = id || 'NULL';
  // We don't want to trigger a re-render by using useSmartCardState
  const { store } = useSmartLinkContext();
  const state = store ? getUrl(store, url) : undefined;
  const details = state ? state.details : undefined;

  const extractedDefinitionId = getDefinitionId(details);
  const extractedExtensionKey = getExtensionKey(details);
  const extractedResourceType = getResourceType(details);
  const extractedSubproduct = getSubproduct(details);
  const extractedProduct = getProduct(details);
  const extractedStatusDetails = getStatusDetails(details);

  const commonAttributes: CommonEventProps = useMemo(
    () => ({
      id: defaultId,
      definitionId: extractedDefinitionId,
      extensionKey: extractedExtensionKey,
      resourceType: extractedResourceType,
      destinationObjectType: extractedResourceType,
      destinationSubproduct: extractedSubproduct,
      destinationProduct: extractedProduct,
      location: defaultLocation,
      statusDetails: extractedStatusDetails,
    }),
    [
      defaultId,
      extractedDefinitionId,
      extractedExtensionKey,
      extractedResourceType,
      extractedSubproduct,
      extractedProduct,
      defaultLocation,
      extractedStatusDetails,
    ],
  );

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
      authEvent: ({
        display,
        extensionKey,
        definitionId,
        resourceType,
        destinationProduct,
        destinationSubproduct,
        location,
      }: UiAuthEventProps) =>
        dispatchAnalytics(
          applyCommonAttributes(
            uiAuthEvent({
              display,
              extensionKey,
              definitionId,
              resourceType,
              destinationProduct,
              destinationSubproduct,
              location,
            }),
            commonAttributes,
          ),
        ),
      /**
       * This fires an event that represents when a user clicks on the authentication
       * call to action with a forbidden authenticated account. (i.e. Try another account).
       * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @returns
       */
      authAlternateAccountEvent: ({
        display,
        extensionKey,
        definitionId,
        resourceType,
        destinationProduct,
        destinationSubproduct,
        location,
      }: UiAuthAlternateAccountEventProps) =>
        dispatchAnalytics(
          applyCommonAttributes(
            uiAuthAlternateAccountEvent({
              display,
              extensionKey,
              definitionId,
              resourceType,
              destinationProduct,
              destinationSubproduct,
              location,
            }),
            commonAttributes,
          ),
        ),
      /**
       * This fires an event that represents when a user
       * click a button.
       * @param data A partial analytics event payload
       */
      buttonClickedEvent: (
        data: Partial<AnalyticsPayload> & {
          actionSubjectId: Required<string>;
        },
      ) =>
        dispatchAnalytics(
          applyCommonAttributes(
            {
              action: 'clicked',
              actionSubject: 'button',
              actionSubjectId: data.actionSubjectId,
              attributes: { ...context, ...data.attributes },
              eventType: 'ui',
            },
            commonAttributes,
          ),
        ),
      /**
       * This fires an event that represents when a user clicks on a Smart Link.
       * @param id The unique ID for this Smart Link.
       * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
       * @param status What status the Smart Link is currently in (e.g. resolved, unresolved)
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @param isModifierKeyPressed Whether a modifier key was pressed when clicking the Smart Link.
       * @param location Where the Smart Link is currently rendered.
       * @param destinationProduct The product the Smart Link is linked to.
       * @returns
       */
      cardClickedEvent: ({
        id,
        display,
        status,
        definitionId,
        extensionKey,
        isModifierKeyPressed,
        location,
        destinationProduct,
        destinationSubproduct,
        actionSubjectId,
      }: UiCardClickedEventProps) =>
        dispatchAnalytics(
          applyCommonAttributes(
            uiCardClickedEvent({
              id,
              display,
              status,
              definitionId,
              extensionKey,
              isModifierKeyPressed,
              location,
              destinationProduct,
              destinationSubproduct,
              actionSubjectId,
            }),
            commonAttributes,
          ),
        ),
      /**
       * This fires an event that represents when a user dwells their cursor on a Smart Link's iframe.
       * @param id The unique ID for this Smart Link.
       * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
       * @param status What status the Smart Link is currently in (e.g. resolved, unresolved)
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @param location Where the Smart Link is currently rendered.
       * @param destinationProduct The product the Smart Link is linked to.
       * @param dwellTime Total seconds that the user has dwelled on this iframe
       * @param dwellPercentVisible Percentage element was visible at end of dwell
       * @returns
       */
      iframeDwelledEvent: ({
        id,
        display,
        status,
        definitionId,
        extensionKey,
        location,
        destinationProduct,
        destinationSubproduct,
        dwellTime,
        dwellPercentVisible,
      }: UiIframeDwelledEventProps) =>
        dispatchAnalytics(
          applyCommonAttributes(
            uiIframeDwelledEvent({
              id,
              display,
              status,
              definitionId,
              extensionKey,
              location,
              destinationProduct,
              destinationSubproduct,
              dwellTime,
              dwellPercentVisible,
            }),
            commonAttributes,
          ),
        ),
      /**
       * This fires an event that represents when a user clicks or tabs into a Smart Link's iframe.
       * @param id The unique ID for this Smart Link.
       * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
       * @param status What status the Smart Link is currently in (e.g. resolved, unresolved)
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @param location Where the Smart Link is currently rendered.
       * @param destinationProduct The product the Smart Link is linked to.
       * @returns
       */
      iframeFocusedEvent: ({
        id,
        display,
        status,
        definitionId,
        extensionKey,
        location,
        destinationProduct,
        destinationSubproduct,
      }: UiIframeFocusedEventProps) =>
        dispatchAnalytics(
          applyCommonAttributes(
            uiIframeFocusedEvent({
              id,
              display,
              status,
              definitionId,
              extensionKey,
              location,
              destinationProduct,
              destinationSubproduct,
            }),
            commonAttributes,
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
      actionClickedEvent: ({
        id,
        actionType,
        display,
        invokeType,
        extensionKey,
        definitionId,
        resourceType,
        destinationProduct,
        destinationSubproduct,
        location,
      }: UiActionClickedEventProps) => {
        startUfoExperience('smart-link-action-invocation', id, {
          actionType,
          display,
          extensionKey,
          invokeType,
        });
        dispatchAnalytics(
          applyCommonAttributes(
            uiActionClickedEvent({
              id,
              actionType,
              display,
              extensionKey,
              definitionId,
              resourceType,
              destinationProduct,
              destinationSubproduct,
              location,
            }),
            commonAttributes,
          ),
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
      hoverCardOpenLinkClickedEvent: ({
        previewDisplay,
        definitionId,
        extensionKey,
        destinationProduct,
        destinationSubproduct,
        location,
        previewInvokeMethod,
      }: UiHoverCardOpenLinkClickedEventProps) => {
        dispatchAnalytics(
          applyCommonAttributes(
            uiHoverCardOpenLinkClickedEvent({
              id: defaultId,
              previewDisplay,
              definitionId,
              extensionKey,
              destinationProduct,
              destinationSubproduct,
              location,
              previewInvokeMethod,
            }),
            commonAttributes,
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
      closedAuthEvent: ({
        display,
        extensionKey,
        definitionId,
        resourceType,
        destinationProduct,
        destinationSubproduct,
        location,
      }: UiClosedAuthEventProps) =>
        dispatchAnalytics(
          applyCommonAttributes(
            uiClosedAuthEvent({
              display,
              extensionKey,
              definitionId,
              resourceType,
              destinationProduct,
              destinationSubproduct,
              location,
            }),
            commonAttributes,
          ),
        ),
      /**
       * This fires an event that represents when a user close a modal.
       * @param data A partial analytics event payload
       */
      modalClosedEvent: (
        data: Partial<AnalyticsPayload> & {
          actionSubjectId: Required<string>;
        },
      ) =>
        dispatchAnalytics(
          applyCommonAttributes(
            {
              action: 'closed',
              actionSubject: 'modal',
              actionSubjectId: data.actionSubjectId,
              attributes: { ...context, ...data.attributes },
              eventType: 'ui',
            },
            commonAttributes,
          ),
        ),
      /**
       * This fires an event that represents when a Smart Link was rendered successfully.
       * Note: this fires even if the Smart Link request errored out.
       * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
       * @param id The unique ID for this Smart Link.
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       */
      renderSuccessEvent: ({
        display,
        status,
        id,
        extensionKey,
        definitionId,
        resourceType,
        destinationProduct,
        destinationSubproduct,
        location,
      }: UiRenderSuccessEventProps) => {
        const experienceId = id ? id : defaultId;
        succeedUfoExperience('smart-link-rendered', experienceId, {
          extensionKey,
          display,
        });

        // UFO will disregard this if authentication experience has not yet been started
        succeedUfoExperience('smart-link-authenticated', experienceId, {
          display,
        });

        dispatchAnalytics(
          applyCommonAttributes(
            uiRenderSuccessEvent({
              display,
              status,
              extensionKey,
              definitionId,
              resourceType,
              destinationProduct,
              destinationSubproduct,
              location,
            }),
            commonAttributes,
          ),
        );
      },
      /**
       * This fires an event that represents when a Smart Link renders unsuccessfuly.
       * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
       * @param id The unique ID for this Smart Link.
       * @param error: An error representing why the Smart Link render failed.
       * @param errorInfo: Additional details about the error including the stack trace.
       */
      renderFailedEvent: ({
        display,
        id,
        error,
        errorInfo,
        extensionKey,
        definitionId,
        resourceType,
        destinationProduct,
        destinationSubproduct,
        location,
      }: UiRenderFailedEventProps) => {
        const experienceId = id ? id : defaultId;
        // Start and fail the smart-link-rendered experience. If it has already
        // been started nothing happens.
        startUfoExperience('smart-link-rendered', experienceId);
        failUfoExperience('smart-link-rendered', experienceId);
        failUfoExperience('smart-link-authenticated', experienceId);

        dispatchAnalytics(
          applyCommonAttributes(
            uiRenderFailedEvent({
              display,
              error,
              errorInfo,
              extensionKey,
              definitionId,
              resourceType,
              destinationProduct,
              destinationSubproduct,
              location,
            }),
            commonAttributes,
          ),
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
      hoverCardViewedEvent: ({
        previewDisplay,
        previewInvokeMethod,
        id,
        extensionKey,
        definitionId,
        resourceType,
        destinationProduct,
        destinationSubproduct,
        location,
        status,
      }: UiHoverCardViewedEventProps) =>
        dispatchAnalytics(
          applyCommonAttributes(
            uiHoverCardViewedEvent({
              id,
              previewDisplay,
              extensionKey,
              definitionId,
              resourceType,
              destinationProduct,
              destinationSubproduct,
              location,
              previewInvokeMethod,
              status,
            }),
            commonAttributes,
          ),
        ),
      /**
       * This fires an event that represents a hover preview being dismissed.
       * @param hoverDisplay Whether the hover preview was displayed as a card or embed.
       * @param hoverTime The duration that the user hovered over a Smart Link before the preview was dismissed.
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resolver invoked.
       * @param previewInvokeMethod How the preview was triggered.
       * @returns
       */
      hoverCardDismissedEvent: ({
        id,
        previewDisplay,
        hoverTime,
        previewInvokeMethod,
        extensionKey,
        definitionId,
        resourceType,
        destinationProduct,
        destinationSubproduct,
        location,
        status,
      }: UiHoverCardDismissedEventProps) =>
        dispatchAnalytics(
          applyCommonAttributes(
            uiHoverCardDismissedEvent({
              previewDisplay,
              id,
              hoverTime,
              extensionKey,
              definitionId,
              resourceType,
              destinationProduct,
              destinationSubproduct,
              location,
              previewInvokeMethod,
              status,
            }),
            commonAttributes,
          ),
        ),

      /**
       * Fires an event that signifies that a "Learn More" link was clicked on an unauthenticated card
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @param location The location where a link is displayed (jiraWebLinks, confluencePages etc)
       */
      learnMoreClickedEvent: () =>
        dispatchAnalytics(
          applyCommonAttributes(
            uiLearnMoreLinkClickedEvent(),
            commonAttributes,
          ),
        ),

      /**
       * Fires an event that represent a click was performed on a Status Lozenge
       */
      smartLinkLozengeActionClickedEvent: () =>
        dispatchAnalytics(
          applyCommonAttributes(
            uiSmartLinkStatusLozengeButtonClicked(),
            commonAttributes,
          ),
        ),

      /**
       * Fires an event that represent a click was performed on a Status Lozenge's dropdown item
       */
      smartLinkLozengeActionListItemClickedEvent: () =>
        dispatchAnalytics(
          applyCommonAttributes(
            uiSmartLinkStatusListItemButtonClicked(),
            commonAttributes,
          ),
        ),

      /**
       * Fires an event that represent a click was performed on a Status Lozenge open preview button
       */
      smartLinkLozengeActionErrorOpenPreviewClickedEvent: () =>
        dispatchAnalytics(
          applyCommonAttributes(
            uiSmartLinkStatusOpenPreviewButtonClicked(),
            commonAttributes,
          ),
        ),
    }),
    [defaultId, commonAttributes, dispatchAnalytics],
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
      invokeSucceededEvent: ({
        id,
        actionType,
        display,
        extensionKey,
        definitionId,
        resourceType,
        destinationProduct,
        destinationSubproduct,
        location,
      }: InvokeSucceededEventProps) => {
        succeedUfoExperience('smart-link-action-invocation', id);
        dispatchAnalytics(
          applyCommonAttributes(
            invokeSucceededEvent({
              id,
              actionType,
              display,
              extensionKey,
              definitionId,
              resourceType,
              destinationProduct,
              destinationSubproduct,
              location,
            }),
            commonAttributes,
          ),
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
      invokeFailedEvent: ({
        id,
        actionType,
        display,
        reason,
        extensionKey,
        definitionId,
        resourceType,
        destinationProduct,
        destinationSubproduct,
        location,
      }: InvokeFailedEventProps) => {
        failUfoExperience('smart-link-action-invocation', id);
        dispatchAnalytics(
          applyCommonAttributes(
            invokeFailedEvent({
              id,
              actionType,
              display,
              reason,
              extensionKey,
              definitionId,
              resourceType,
              destinationProduct,
              destinationSubproduct,
              location,
            }),
            commonAttributes,
          ),
        );
      },
      /**
       * This fires an event that represents an account successfully being connected via a Smart Link.
       * @param id The unique ID for this Smart Link.
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       */
      connectSucceededEvent: ({
        id,
        extensionKey,
        definitionId,
        resourceType,
        destinationProduct,
        destinationSubproduct,
        location,
      }: ConnectSucceededEventProps) => {
        const experienceId = id ? id : defaultId;
        startUfoExperience('smart-link-authenticated', experienceId, {
          extensionKey,
          status: 'success',
        });
        dispatchAnalytics(
          applyCommonAttributes(
            connectSucceededEvent({
              ...commonAttributes,
              id: experienceId,
              extensionKey,
              definitionId,
              resourceType,
              destinationProduct,
              destinationSubproduct,
              location,
            }),
            commonAttributes,
          ),
        );
      },
      /**
       * This fires an event that represents an account unsuccessfully being connected.
       * @param id The unique ID for this Smart Link.
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @param reason The reason why the Smart Link connect account failed.
       */
      connectFailedEvent: ({
        id,
        reason,
        extensionKey,
        definitionId,
        resourceType,
        destinationProduct,
        destinationSubproduct,
        location,
      }: ConnectFailedEventProps) => {
        const experienceId = id ? id : defaultId;
        startUfoExperience('smart-link-authenticated', experienceId, {
          extensionKey,
          status: reason,
        });
        dispatchAnalytics(
          applyCommonAttributes(
            connectFailedEvent({
              ...commonAttributes,
              id: experienceId,
              reason,
              extensionKey,
              definitionId,
              resourceType,
              destinationProduct,
              destinationSubproduct,
              location,
            }),
            commonAttributes,
          ),
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
      instrument: ({
        id,
        status,
        extensionKey,
        definitionId,
        resourceType,
        destinationProduct,
        destinationSubproduct,
        location,
        error,
      }: InstrumentEventProps) => {
        const event = instrumentEvent({
          ...commonAttributes,
          id,
          status,
          extensionKey,
          definitionId,
          resourceType,
          destinationProduct,
          destinationSubproduct,
          location,
          error,
        });
        if (event) {
          dispatchAnalytics(applyCommonAttributes(event, commonAttributes));
        }
      },

      /**
       * This fires an event that represents when a Smart Link renders unsuccessfuly.
       * @param display Whether the card was an Inline, Block, Embed or Flexible UI.
       * @param id The unique ID for this Smart Link.
       * @param error: An error representing why the Smart Link render failed.
       * @param errorInfo: Additional details about the error including the stack trace.
       */
      chunkloadFailedEvent: ({
        display,
        error,
        errorInfo,
        extensionKey,
        definitionId,
        resourceType,
        destinationProduct,
        destinationSubproduct,
        location,
      }: UiRenderFailedEventProps) => {
        dispatchAnalytics(
          applyCommonAttributes(
            chunkloadFailedEvent({
              display,
              error,
              errorInfo,
              extensionKey,
              definitionId,
              resourceType,
              destinationProduct,
              destinationSubproduct,
              location,
            }),
            commonAttributes,
          ),
        );
      },
    }),
    [defaultId, commonAttributes, dispatchAnalytics],
  );

  /** Contains all track analytics events */
  const track = useMemo(
    () => ({
      /**
       * This fires an event which represents a user connecting their account to view a Smart Link.
       * @param definitionId The definitionId of the Smart Link resolver invoked.
       * @param extensionKey The extensionKey of the Smart Link resovler invoked.
       * @returns
       */
      appAccountConnected: ({
        extensionKey,
        definitionId,
        resourceType,
        destinationProduct,
        destinationSubproduct,
        location,
      }: TrackAppAccountConnectedProps) =>
        dispatchAnalytics(
          applyCommonAttributes(
            trackAppAccountConnected({
              ...commonAttributes,
              extensionKey,
              definitionId,
              resourceType,
              destinationProduct,
              destinationSubproduct,
              location,
            }),
            commonAttributes,
          ),
        ),

      /**
       * This fires an event which represents a user starting the Smart Link connect account process.
       * @param location a location where the Smart Link auth action was initiated.
       * @param extensionKey The extensionKey of the Smart Link resolver invoked.
       * @returns
       */
      appAccountAuthStarted: ({
        extensionKey,
        location,
      }: TrackAppAccountConnectedProps) =>
        dispatchAnalytics(
          applyCommonAttributes(
            trackAppAccountAuthStarted({
              ...commonAttributes,
              extensionKey,
              location,
            }),
            commonAttributes,
          ),
        ),

      /**
       * Removed in EDM-5153: This is an even from an experiment.
       * @deprecated
       */
      linkUpdated: (props: CommonEventProps & { [key: string]: any }) => {},

      /**
       * This fires a tracking event before an action invoke api call is made
       */
      smartLinkQuickActionStarted: (props: {
        smartLinkActionType: SmartLinkActionType | TrackQuickActionType;
      }) =>
        dispatchAnalytics(
          applyCommonAttributes(
            trackSmartLinkQuickActionStarted({ ...commonAttributes, ...props }),
            commonAttributes,
          ),
        ),

      /**
       * This fires a tracking event after an action invoke api call is successful
       */
      smartLinkQuickActionSuccess: (props: {
        smartLinkActionType: SmartLinkActionType | TrackQuickActionType;
      }) =>
        dispatchAnalytics(
          applyCommonAttributes(
            trackSmartLinkQuickActionSuccess({ ...commonAttributes, ...props }),
            commonAttributes,
          ),
        ),

      /**
       * This fires a tracking event after an action invoke api call has failed
       */
      smartLinkQuickActionFailed: (props: {
        smartLinkActionType: SmartLinkActionType | TrackQuickActionType;
        reason?: TrackQuickActionFailureReason;
        step?: string;
      }) =>
        dispatchAnalytics(
          applyCommonAttributes(
            trackSmartLinkQuickActionFailed({ ...commonAttributes, ...props }),
            commonAttributes,
          ),
        ),

      /**
       * Fires a track event when we call loadMetadata() to get information for a hover card
       */
      hoverCardResolutionStarted: () =>
        dispatchAnalytics(
          applyCommonAttributes(
            trackHoverCardResolutionStarted({
              display: 'hoverCardPreview',
              ...commonAttributes,
            }),
            commonAttributes,
          ),
        ),
    }),

    [commonAttributes, dispatchAnalytics],
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
      authPopupEvent: ({
        extensionKey,
        definitionId,
        resourceType,
        destinationProduct,
        destinationSubproduct,
        location,
      }: ScreenAuthPopupEventProps) =>
        dispatchAnalytics(
          applyCommonAttributes(
            screenAuthPopupEvent({
              ...commonAttributes,
              extensionKey,
              definitionId,
              resourceType,
              destinationProduct,
              destinationSubproduct,
              location,
            }),
            commonAttributes,
          ),
        ),
      /**
       * This fires an event that represents when a user view a modal.
       * @param data A partial analytics event payload
       */
      modalViewedEvent: (
        data: Partial<AnalyticsPayload> & {
          name: Extract<AnalyticsName, 'embedPreviewModal'>;
        },
      ) =>
        dispatchAnalytics(
          applyCommonAttributes(
            {
              action: 'viewed',
              actionSubject: data.name,
              attributes: { ...context, ...data.attributes },
              eventType: 'screen',
              name: data.name,
            },
            commonAttributes,
          ),
        ),
    }),
    [commonAttributes, dispatchAnalytics],
  );

  return useMemo(
    () => ({ ui, operational, track, screen }),
    [ui, operational, track, screen],
  );
};

export type AnalyticsFacade = ReturnType<typeof useSmartLinkAnalytics>;
