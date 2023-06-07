import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

import { AnalyticsPayload } from '../types';
import { CardInnerAppearance } from '../../view/Card/types';
import { getMeasure } from '../performance';
import {
  CommonEventProps,
  ConnectFailedEventProps,
  ConnectSucceededEventProps,
  InvokeFailedEventProps,
  InvokeSucceededEventProps,
  ResolvedEventProps,
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
  UnresolvedEventProps,
} from './types';
import { SmartLinkActionType } from '@atlaskit/linking-types';
export const ANALYTICS_CHANNEL = 'media';

export const context = {
  componentName: 'smart-cards',
  packageName,
  packageVersion,
};

export enum TrackQuickActionType {
  StatusUpdate = 'StatusUpdate',
}

export enum TrackQuickActionFailureReason {
  PermissionError = 'PermissionError',
  ValidationError = 'ValidationError',
  UnknownError = 'UnknownError',
}

const uiActionSubjectIds: Record<string, string> = {
  DownloadAction: 'downloadDocument',
  PreviewAction: 'invokePreviewScreen',
  ViewAction: 'shortcutGoToLink',
  StatusAction: 'issueStatusUpdate',
};

export class SmartLinkEvents {
  public insertSmartLink(
    url: string,
    type: CardInnerAppearance,
    createAnalyticsEvent?: CreateUIAnalyticsEvent,
  ) {
    fireSmartLinkEvent(
      {
        action: 'inserted',
        actionSubject: 'smartLink',
        eventType: 'track',
        attributes: {
          type,
        },
        nonPrivacySafeAttributes: {
          domainName: url,
        },
      },
      createAnalyticsEvent,
    );
  }
}

export const fireSmartLinkEvent = (
  payload: AnalyticsPayload,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
) => {
  if (createAnalyticsEvent) {
    createAnalyticsEvent(payload).fire(ANALYTICS_CHANNEL);
  }
};

export const resolvedEvent = (props: ResolvedEventProps): AnalyticsPayload => ({
  action: 'resolved',
  actionSubject: 'smartLink',
  eventType: 'operational',
  attributes: {
    ...props,
    ...context,
  },
});

export const unresolvedEvent = ({
  id,
  definitionId,
  extensionKey,
  resourceType,
  destinationSubproduct,
  destinationProduct,
  error,
  status,
  location,
}: UnresolvedEventProps): AnalyticsPayload => ({
  action: 'unresolved',
  actionSubject: 'smartLink',
  eventType: 'operational',
  attributes: {
    id,
    ...context,
    ...(definitionId ? { definitionId } : {}),
    ...(extensionKey ? { extensionKey } : {}),
    ...(resourceType ? { resourceType } : {}),
    ...(destinationSubproduct ? { destinationSubproduct } : {}),
    ...(destinationProduct ? { destinationProduct } : {}),
    ...(location ? { location } : {}),
    reason: status,
    error: error
      ? {
          message: error?.message,
          kind: error?.kind,
          type: error?.type,
        }
      : undefined,
  },
});

export const invokeSucceededEvent = ({
  id,
  actionType,
  display,
  extensionKey,
  definitionId,
  destinationProduct,
  destinationSubproduct,
  location,
}: InvokeSucceededEventProps): AnalyticsPayload => {
  const measure = getMeasure(id, 'resolved') || { duration: undefined };
  return {
    action: 'resolved',
    actionSubject: 'smartLinkAction',
    eventType: 'operational',
    attributes: {
      ...context,
      id,
      actionType,
      display,
      definitionId,
      destinationProduct,
      destinationSubproduct,
      location,
      extensionKey,
      duration: measure.duration,
    },
  };
};

export const invokeFailedEvent = ({
  id,
  actionType,
  display,
  reason,
  extensionKey,
  definitionId,
  destinationProduct,
  destinationSubproduct,
  location,
}: InvokeFailedEventProps): AnalyticsPayload => {
  const measure = getMeasure(id, 'errored') || { duration: undefined };
  return {
    action: 'unresolved',
    actionSubject: 'smartLinkAction',
    eventType: 'operational',
    attributes: {
      ...context,
      id,
      actionType,
      display,
      extensionKey,
      definitionId,
      destinationProduct,
      destinationSubproduct,
      location,
      duration: measure.duration,
      reason,
    },
  };
};

export const connectSucceededEvent = ({
  definitionId,
  extensionKey,
  destinationProduct,
  destinationSubproduct,
  location,
}: ConnectSucceededEventProps): AnalyticsPayload => ({
  action: 'connectSucceeded',
  actionSubject: 'smartLink',
  eventType: 'operational',
  attributes: {
    ...context,
    definitionId,
    extensionKey,
    destinationProduct,
    destinationSubproduct,
    location,
  },
});

export const connectFailedEvent = ({
  definitionId,
  extensionKey,
  destinationProduct,
  destinationSubproduct,
  location,
  reason,
}: ConnectFailedEventProps): AnalyticsPayload => ({
  action: 'connectFailed',
  actionSubject: 'smartLink',
  actionSubjectId: reason,
  eventType: 'operational',
  attributes: {
    ...context,
    reason,
    extensionKey,
    definitionId,
    destinationProduct,
    destinationSubproduct,
    location,
  },
});

export const trackAppAccountConnected = ({
  definitionId,
  extensionKey,
  destinationProduct,
  destinationSubproduct,
  location,
}: TrackAppAccountConnectedProps): AnalyticsPayload => ({
  action: 'connected',
  actionSubject: 'applicationAccount',
  eventType: 'track',
  attributes: {
    ...context,
    definitionId,
    extensionKey,
    destinationProduct,
    destinationSubproduct,
    location,
  },
});

export const trackAppAccountAuthStarted = ({
  extensionKey,
  location,
}: TrackAppAccountConnectedProps): AnalyticsPayload => ({
  action: 'authStarted',
  actionSubject: 'applicationAccount',
  eventType: 'track',
  attributes: {
    ...context,
    extensionKey,
    location,
  },
});

export const trackSmartLinkQuickActionStarted = ({
  smartLinkActionType,
  ...attributes
}: CommonEventProps & {
  smartLinkActionType: SmartLinkActionType | TrackQuickActionType;
}): AnalyticsPayload => ({
  action: 'started',
  actionSubject: 'smartLinkQuickAction',
  eventType: 'track',
  attributes: {
    ...context,
    ...attributes,
    smartLinkActionType,
  },
});

export const trackSmartLinkQuickActionSuccess = ({
  smartLinkActionType,
  ...attributes
}: CommonEventProps & {
  smartLinkActionType: SmartLinkActionType | TrackQuickActionType;
}): AnalyticsPayload => ({
  action: 'success',
  actionSubject: 'smartLinkQuickAction',
  eventType: 'track',
  attributes: {
    ...context,
    ...attributes,
    smartLinkActionType,
  },
});

export const trackSmartLinkQuickActionFailed = ({
  smartLinkActionType,
  ...attributes
}: CommonEventProps & {
  smartLinkActionType: SmartLinkActionType | TrackQuickActionType;
}): AnalyticsPayload => ({
  action: 'failed',
  actionSubject: 'smartLinkQuickAction',
  eventType: 'track',
  attributes: {
    ...context,
    ...attributes,
    smartLinkActionType,
  },
});

export const uiAuthEvent = ({
  definitionId,
  extensionKey,
  destinationProduct,
  destinationSubproduct,
  location,
  display,
}: UiAuthEventProps): AnalyticsPayload => ({
  action: 'clicked',
  actionSubject: 'button',
  actionSubjectId: 'connectAccount',
  eventType: 'ui',
  attributes: {
    ...context,
    definitionId,
    extensionKey,
    destinationProduct,
    destinationSubproduct,
    location,
    display,
  },
});

export const uiAuthAlternateAccountEvent = ({
  definitionId,
  extensionKey,
  destinationProduct,
  destinationSubproduct,
  location,
  display,
}: UiAuthAlternateAccountEventProps): AnalyticsPayload => ({
  action: 'clicked',
  actionSubject: 'smartLink',
  actionSubjectId: 'tryAnotherAccount',
  eventType: 'ui',
  attributes: {
    ...context,
    definitionId,
    extensionKey,
    destinationProduct,
    destinationSubproduct,
    location,
    display,
  },
});

export const uiCardClickedEvent = ({
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
}: UiCardClickedEventProps): AnalyticsPayload => ({
  action: 'clicked',
  actionSubject: 'smartLink',
  actionSubjectId,
  eventType: 'ui',
  attributes: {
    ...context,
    id,
    status,
    definitionId,
    extensionKey,
    display,
    isModifierKeyPressed,
    location,
    destinationProduct,
    destinationSubproduct,
  },
});

export const uiIframeDwelledEvent = ({
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
}: UiIframeDwelledEventProps): AnalyticsPayload => ({
  action: 'dwelled',
  actionSubject: 'smartLinkIframe',
  eventType: 'ui',
  attributes: {
    ...context,
    id,
    status,
    definitionId,
    extensionKey,
    display,
    location,
    destinationProduct,
    destinationSubproduct,
    dwellTime,
    dwellPercentVisible,
  },
});

export const uiIframeFocusedEvent = ({
  id,
  display,
  status,
  definitionId,
  extensionKey,
  location,
  destinationProduct,
  destinationSubproduct,
}: UiIframeFocusedEventProps): AnalyticsPayload => ({
  action: 'focused',
  actionSubject: 'smartLinkIframe',
  eventType: 'ui',
  attributes: {
    ...context,
    id,
    status,
    definitionId,
    extensionKey,
    display,
    location,
    destinationProduct,
    destinationSubproduct,
  },
});

export const uiActionClickedEvent = ({
  id,
  actionType,
  extensionKey,
  display,
  definitionId,
  destinationProduct,
  destinationSubproduct,
  location,
}: UiActionClickedEventProps): AnalyticsPayload => ({
  action: 'clicked',
  actionSubject: 'button',
  actionSubjectId: uiActionSubjectIds[actionType],
  eventType: 'ui',
  attributes: {
    ...context,
    id,
    display,
    actionType: actionType,
    extensionKey: extensionKey,
    definitionId,
    destinationProduct,
    destinationSubproduct,
    location,
  },
});

export const uiClosedAuthEvent = ({
  display,
  extensionKey,
  definitionId,
  destinationProduct,
  destinationSubproduct,
  location,
}: UiClosedAuthEventProps): AnalyticsPayload => ({
  action: 'closed',
  actionSubject: 'consentModal',
  eventType: 'ui',
  attributes: {
    ...context,
    extensionKey,
    definitionId,
    destinationProduct,
    destinationSubproduct,
    location,
    display,
  },
});

export const screenAuthPopupEvent = ({
  extensionKey,
  definitionId,
  destinationProduct,
  destinationSubproduct,
  location,
}: ScreenAuthPopupEventProps): AnalyticsPayload => ({
  actionSubject: 'consentModal',
  eventType: 'screen',
  attributes: {
    ...context,
    extensionKey,
    definitionId,
    destinationProduct,
    destinationSubproduct,
    location,
  },
});

export const uiRenderSuccessEvent = ({
  display,
  status,
  extensionKey,
  definitionId,
  destinationProduct,
  destinationSubproduct,
  location,
}: UiRenderSuccessEventProps): AnalyticsPayload => ({
  action: 'renderSuccess',
  actionSubject: 'smartLink',
  eventType: 'ui',
  attributes: {
    ...context,
    status,
    extensionKey,
    definitionId,
    destinationProduct,
    destinationSubproduct,
    location,
    display,
  },
});

export const uiRenderFailedEvent = ({
  display,
  error,
  errorInfo,
  extensionKey,
  definitionId,
  destinationProduct,
  destinationSubproduct,
  location,
}: UiRenderFailedEventProps): AnalyticsPayload => ({
  actionSubject: 'smartLink',
  action: 'renderFailed',
  eventType: 'ui',
  attributes: {
    ...context,
    error,
    errorInfo,
    display,
    extensionKey,
    definitionId,
    destinationProduct,
    destinationSubproduct,
    location,
  },
});

export const uiHoverCardViewedEvent = ({
  id,
  previewDisplay,
  extensionKey,
  definitionId,
  destinationProduct,
  destinationSubproduct,
  location,
  previewInvokeMethod,
  status,
}: UiHoverCardViewedEventProps): AnalyticsPayload => ({
  action: 'viewed',
  actionSubject: 'hoverCard',
  eventType: 'ui',
  attributes: {
    ...context,
    id,
    previewDisplay,
    extensionKey,
    definitionId,
    destinationProduct,
    destinationSubproduct,
    location,
    previewInvokeMethod,
    status,
  },
});

export const uiHoverCardDismissedEvent = ({
  id,
  previewDisplay,
  hoverTime,
  extensionKey,
  definitionId,
  destinationProduct,
  destinationSubproduct,
  location,
  previewInvokeMethod,
  status,
}: UiHoverCardDismissedEventProps): AnalyticsPayload => ({
  action: 'dismissed',
  actionSubject: 'hoverCard',
  eventType: 'ui',
  attributes: {
    ...context,
    id,
    previewDisplay,
    hoverTime,
    extensionKey,
    definitionId,
    destinationProduct,
    destinationSubproduct,
    location,
    previewInvokeMethod,
    status,
  },
});

export const uiHoverCardOpenLinkClickedEvent = ({
  id,
  previewDisplay,
  extensionKey,
  definitionId,
  destinationProduct,
  destinationSubproduct,
  location,
  previewInvokeMethod,
}: UiHoverCardOpenLinkClickedEventProps): AnalyticsPayload => ({
  action: 'clicked',
  actionSubject: 'button',
  actionSubjectId: 'shortcutGoToLink',
  eventType: 'ui',
  attributes: {
    ...context,
    id,
    previewDisplay,
    extensionKey,
    definitionId,
    destinationProduct,
    destinationSubproduct,
    location,
    previewInvokeMethod,
  },
});

export const uiLearnMoreLinkClickedEvent = (): AnalyticsPayload => ({
  action: 'clicked',
  actionSubject: 'button',
  actionSubjectId: 'learnMore',
  eventType: 'ui',
  attributes: {
    ...context,
  },
});

export const chunkloadFailedEvent = ({
  display,
  error,
  errorInfo,
  extensionKey,
  definitionId,
  destinationProduct,
  destinationSubproduct,
  location,
}: UiRenderFailedEventProps): AnalyticsPayload => ({
  action: 'chunkLoadFailed',
  actionSubject: 'smartLink',
  eventType: 'operational',
  attributes: {
    ...context,
    error,
    errorInfo,
    display,
    extensionKey,
    definitionId,
    destinationProduct,
    destinationSubproduct,
    location,
  },
});

export const uiSmartLinkStatusLozengeButtonClicked = (): AnalyticsPayload => ({
  action: 'clicked',
  actionSubject: 'button',
  actionSubjectId: 'smartLinkStatusLozenge',
  eventType: 'ui',
  attributes: {
    ...context,
  },
});

export const uiSmartLinkStatusListItemButtonClicked = (): AnalyticsPayload => ({
  action: 'clicked',
  actionSubject: 'button',
  actionSubjectId: 'smartLinkStatusListItem',
  eventType: 'ui',
  attributes: {
    ...context,
  },
});

export const uiSmartLinkStatusOpenPreviewButtonClicked =
  (): AnalyticsPayload => ({
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId: 'smartLinkStatusOpenPreview',
    eventType: 'ui',
    attributes: {
      ...context,
    },
  });
