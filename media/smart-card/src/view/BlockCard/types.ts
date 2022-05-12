import {
  CardProviderRenderers,
  CardAuthFlowOpts,
} from '@atlaskit/link-provider';
import { CardState } from '../../state/types';
import { InvokeHandler } from '../../model/invoke-handler';
import { AnalyticsHandler } from '../../utils/types';
import { OnResolveCallback, CardPlatform } from '../Card/types';

export type BlockCardProps = {
  url: string;
  cardState: CardState;
  authFlow?: CardAuthFlowOpts['authFlow'];
  handleAuthorize: (() => void) | undefined;
  handleErrorRetry: () => void;
  handleAnalytics: AnalyticsHandler;
  handleInvoke: InvokeHandler;
  handleFrameClick: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  isSelected?: boolean;
  onResolve?: OnResolveCallback;
  testId?: string;
  showActions?: boolean;
  renderers?: CardProviderRenderers;
  platform?: CardPlatform;
};
