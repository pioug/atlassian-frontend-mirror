import { CardState } from '../../state/types';
import { InvokeHandler } from '../../client/types';
import { AnalyticsPayload } from '../../utils/types';
import { CardAuthFlowOpts } from '../../state/context/types';

export type BlockCardProps = {
  url: string;
  cardState: CardState;
  authFlow?: CardAuthFlowOpts['authFlow'];
  handleAuthorize: (() => void) | undefined;
  handleErrorRetry: () => void;
  handlePreviewAnalytics: (payload: AnalyticsPayload) => void;
  handleInvoke: InvokeHandler;
  handleFrameClick: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  isSelected?: boolean;
  onResolve?: (data: { url?: string; title?: string }) => void;
  testId?: string;
  showActions?: boolean;
};
