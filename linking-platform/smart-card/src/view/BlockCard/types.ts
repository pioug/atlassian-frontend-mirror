import {
  CardAuthFlowOpts,
  CardProviderRenderers,
} from '@atlaskit/link-provider';
import { CardState } from '../../state/types';
import { InvokeHandler } from '../../model/invoke-handler';
import type {
  CardPlatform,
  OnResolveCallback,
  CardActionOptions,
} from '../Card/types';
import { OnErrorCallback } from '../types';
import { AnalyticsFacade } from '../../state/analytics';

export type BlockCardProps = {
  id: string;
  url: string;
  cardState: CardState;
  authFlow?: CardAuthFlowOpts['authFlow'];
  handleAuthorize: (() => void) | undefined;
  handleErrorRetry: () => void;
  handleInvoke: InvokeHandler;
  handleFrameClick: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  isSelected?: boolean;
  onResolve?: OnResolveCallback;
  onError?: OnErrorCallback;
  testId?: string;
  actionOptions?: CardActionOptions;
  renderers?: CardProviderRenderers;
  platform?: CardPlatform;
  analytics: AnalyticsFacade;
  enableFlexibleBlockCard?: boolean;
};
