import type { AnalyticsFacade } from '../../../../state/analytics';
import { ContextViewModel } from '../../types';
import { UnresolvedViewProps } from '../unresolved-view/types';

export type UnauthorizedViewProps = Pick<
  UnresolvedViewProps,
  'inheritDimensions' | 'isSelected' | 'onClick' | 'testId' | 'url'
> & {
  analytics: AnalyticsFacade;
  context?: ContextViewModel;
  extensionKey?: string;
  onAuthorize?: () => void;
};
