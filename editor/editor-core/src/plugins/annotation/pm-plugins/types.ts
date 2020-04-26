import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { Dispatch, EventDispatcher } from '../../../event-dispatcher';
import { AnnotationTypeProviders } from '../types';

export interface InlineCommentPluginOptions {
  dispatch: Dispatch;
  eventDispatcher: EventDispatcher;
  portalProviderAPI: PortalProviderAPI;
  inlineCommentProvider: AnnotationTypeProviders['inlineComment'];
  pollingInterval?: number;
}
