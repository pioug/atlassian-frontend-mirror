import { EventHandler, MouseEvent, KeyboardEvent } from 'react';
import { CardAppearance } from '../Card/types';
import { CardState } from '../../state/types';

export interface CardWithDataContentProps {
  appearance: CardAppearance;
  data: CardState['details'];
  onClick?: EventHandler<MouseEvent | KeyboardEvent>;
  isSelected?: boolean;
  testId?: string;
  onResolve?: (data: { url?: string; title?: string }) => void;
}
