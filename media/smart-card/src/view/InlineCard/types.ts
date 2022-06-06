import { EventHandler, MouseEvent, KeyboardEvent } from 'react';
import { CardProviderRenderers } from '@atlaskit/link-provider';
import { CardState } from '../../state/types';
import { InlinePreloaderStyle } from '../types';

export type InlineCardProps = {
  id: string;
  url: string;
  cardState: CardState;
  handleAuthorize: (() => void) | undefined;
  handleFrameClick: EventHandler<MouseEvent | KeyboardEvent>;
  isSelected?: boolean;
  testId?: string;
  onResolve?: (data: { url?: string; title?: string }) => void;
  inlinePreloaderStyle?: InlinePreloaderStyle;
  renderers?: CardProviderRenderers;
  showHoverPreview?: boolean;
};
