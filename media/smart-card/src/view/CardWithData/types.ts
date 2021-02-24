import { EventHandler, MouseEvent, KeyboardEvent } from 'react';
import { CardAppearance } from '../Card/types';
import { JsonLd } from 'json-ld-types';
import { InlinePreloaderStyle } from '@atlaskit/media-ui/types';

export interface CardWithDataContentProps {
  appearance: CardAppearance;
  data: JsonLd.Data.BaseData;
  onClick?: EventHandler<MouseEvent | KeyboardEvent>;
  isSelected?: boolean;
  testId?: string;
  onResolve?: (data: { url?: string; title?: string }) => void;
  showActions?: boolean;
  inlinePreloaderStyle?: InlinePreloaderStyle;
}
