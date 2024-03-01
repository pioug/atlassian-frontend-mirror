import type { AnalyticsFacade } from '../../../../state/analytics';
import type { ContextViewModel } from '../../types';
import type { UnresolvedViewCardProps } from '../unresolved-view/types';

export type UnauthorizedViewProps = UnresolvedViewCardProps & {
  analytics: AnalyticsFacade;
  context?: ContextViewModel;
  extensionKey?: string;
  isProductIntegrationSupported?: boolean;
  onAuthorize?: () => void;
};
