import { getMeasure } from '../performance';
import { AnalyticsPayload } from '../types';
import { resolvedEvent, unresolvedEvent } from './analytics';
import { InstrumentEventProps } from './types';

export {
  ANALYTICS_CHANNEL,
  context,
  fireSmartLinkEvent,
  resolvedEvent,
  unresolvedEvent,
  invokeSucceededEvent,
  invokeFailedEvent,
  connectSucceededEvent,
  connectFailedEvent,
  trackAppAccountAuthStarted,
  trackAppAccountConnected,
  uiAuthEvent,
  uiAuthAlternateAccountEvent,
  uiCardClickedEvent,
  uiActionClickedEvent,
  uiClosedAuthEvent,
  screenAuthPopupEvent,
  uiRenderSuccessEvent,
  uiRenderFailedEvent,
  uiHoverCardViewedEvent,
  uiHoverCardDismissedEvent,
  uiHoverCardOpenLinkClickedEvent,
  uiLearnMoreLinkClickedEvent,
} from './analytics';

export const instrumentEvent = ({
  id,
  status,
  extensionKey,
  definitionId,
  resourceType,
  destinationProduct,
  destinationSubproduct,
  location,
  error,
}: InstrumentEventProps): AnalyticsPayload | undefined => {
  const measure = getMeasure(id, status) || { duration: undefined };
  if (status === 'resolved') {
    const event = resolvedEvent({
      id,
      extensionKey,
      definitionId,
      resourceType,
      destinationProduct,
      destinationSubproduct,
      location,
    });
    return {
      ...event,
      attributes: {
        ...event.attributes,
        duration: measure.duration,
      },
    };
  } else {
    if (error?.type !== 'ResolveUnsupportedError') {
      const event = unresolvedEvent({
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
      return {
        ...event,
        attributes: {
          ...event.attributes,
          duration: measure.duration,
        },
      };
    }
  }
};
