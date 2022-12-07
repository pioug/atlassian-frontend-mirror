import { AnalyticsFacade } from '../../../../../state/analytics';
import { LinkAction } from '../../../../../state/hooks-external/useSmartLinkActions';
import { CardState } from '@atlaskit/linking-common';
import { HoverCardLoadingViewProps } from '../resolving/types';

export type HoverCardResolvedProps = {
  extensionKey?: string;
  id?: string;
  url: string;
  analytics: AnalyticsFacade;
  cardActions?: LinkAction[];
  cardState: CardState;
  onActionClick: (actionId: string) => void;
} & HoverCardLoadingViewProps;
