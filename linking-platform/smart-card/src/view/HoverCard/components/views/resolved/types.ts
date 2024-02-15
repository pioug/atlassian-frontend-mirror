import { AnalyticsFacade } from '../../../../../state/analytics';
import { LinkAction } from '../../../../../state/hooks-external/useSmartLinkActions';
import { CardState } from '@atlaskit/linking-common';
import { HoverCardLoadingViewProps } from '../resolving/types';
import { AISummaryBlockProps } from '../../../../FlexibleCard/components/blocks/ai-summary-block/types';

export type HoverCardResolvedProps = {
  extensionKey?: string;
  id?: string;
  url: string;
  analytics: AnalyticsFacade;
  cardActions?: LinkAction[];
  cardState: CardState;
  isAISummaryEnabled?: boolean;
  onActionClick: (actionId: string) => void;
  onAIActionChange?: AISummaryBlockProps['onAIActionChange'];
} & HoverCardLoadingViewProps;
