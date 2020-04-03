import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { Dispatch } from '../../../event-dispatcher';
import { AnnotationTypeProviders } from '../types';

export interface InlineCommentPluginOptions {
  dispatch: Dispatch;
  portalProviderAPI: PortalProviderAPI;
  inlineCommentProvider: AnnotationTypeProviders['inlineComment'];
  pollingInterval?: number;
}
