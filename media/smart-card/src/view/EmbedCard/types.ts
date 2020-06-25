import { CardState } from '../../state/types';
import { InvokeHandler } from '../../model/invoke-handler';
import { AnalyticsHandler } from '../../utils/types';
import { CardPlatform } from '../Card/types';

export type EmbedCardProps = {
  url: string;
  cardState: CardState;
  handleAuthorize: (() => void) | undefined;
  handleErrorRetry: () => void;
  handleFrameClick: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  handleAnalytics: AnalyticsHandler;
  handleInvoke: InvokeHandler;
  isSelected?: boolean;
  isFrameVisible?: boolean;
  platform?: CardPlatform;
  onResolve?: (data: { url?: string; title?: string }) => void;
  testId?: string;
  inheritDimensions?: boolean;
  showActions?: boolean;
};
