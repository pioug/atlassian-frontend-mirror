import { EventHandler, MouseEvent, KeyboardEvent } from 'react';
import { CardState } from '../../state/types';
import { InlinePreloaderStyle } from '@atlaskit/media-ui/types';

export type InlineCardProps = {
  url: string;
  cardState: CardState;
  handleAuthorize: (() => void) | undefined;
  handleFrameClick: EventHandler<MouseEvent | KeyboardEvent>;
  isSelected?: boolean;
  testId?: string;
  onResolve?: (data: { url?: string; title?: string }) => void;
  inlinePreloaderStyle?: InlinePreloaderStyle;
};
