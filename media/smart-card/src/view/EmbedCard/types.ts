import { CardState } from '../../state/types';
import { InvokeHandler } from '../../model/invoke-handler';
import { AnalyticsHandler } from '../../utils/types';
import { CardPlatform, OnResolveCallback } from '../Card/types';

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
  onResolve?: OnResolveCallback;
  testId?: string;
  inheritDimensions?: boolean;
  showActions?: boolean;
};
