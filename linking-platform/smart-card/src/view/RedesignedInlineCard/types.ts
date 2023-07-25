import { EventHandler, MouseEvent, KeyboardEvent } from 'react';
import { CardProviderRenderers } from '@atlaskit/link-provider';
import { CardState } from '../../state/types';
import { InlinePreloaderStyle, OnErrorCallback } from '../types';
import { AnalyticsFacade } from '../../state/analytics';

export type InlineCardProps = {
  id: string;
  url: string;
  cardState: CardState;
  handleAuthorize: (() => void) | undefined;
  handleFrameClick: EventHandler<MouseEvent | KeyboardEvent>;
  isSelected?: boolean;
  testId?: string;
  onResolve?: (data: { url?: string; title?: string }) => void;
  onError?: OnErrorCallback;
  inlinePreloaderStyle?: InlinePreloaderStyle;
  renderers?: CardProviderRenderers;
  showHoverPreview?: boolean;
  showAuthTooltip?: boolean;
  showServerActions?: boolean;
  analytics: AnalyticsFacade;
};
