import { resolvedEvent, unresolvedEvent } from './analytics';
import { CardType } from '../../state/store/types';
import { APIError } from '../../client/errors';
import { AnalyticsPayload } from '../types';
import { getMeasure } from '../performance';

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
  trackAppAccountConnected,
  uiAuthEvent,
  uiAuthAlternateAccountEvent,
  uiCardClickedEvent,
  uiActionClickedEvent,
  uiClosedAuthEvent,
  screenAuthPopupEvent,
  uiRenderSuccessEvent,
  uiRenderFailedEvent,
} from './analytics';

export const instrumentEvent = (
  id: string,
  status: CardType,
  definitionId?: string,
  extensionKey?: string,
  resourceType?: string,
  error?: APIError,
): AnalyticsPayload | undefined => {
  const measure = getMeasure(id, status) || { duration: undefined };
  if (status === 'resolved') {
    const event = resolvedEvent(id, definitionId, extensionKey, resourceType);
    return {
      ...event,
      attributes: {
        ...event.attributes,
        duration: measure.duration,
      },
    };
  } else {
    if (error?.type !== 'ResolveUnsupportedError') {
      const event = unresolvedEvent(
        id,
        status,
        definitionId,
        extensionKey,
        resourceType,
        error,
      );
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
