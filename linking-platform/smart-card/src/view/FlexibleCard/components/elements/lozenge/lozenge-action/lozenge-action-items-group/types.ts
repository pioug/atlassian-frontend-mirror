import { type LozengeItem } from '../types';
import { type ThemeAppearance } from '@atlaskit/lozenge';

export type LozengeActionItemsGroupProps = {
  items: LozengeItem[];
  testId?: string;
  onClick?: (
    id: string,
    text: string,
    appearance?: ThemeAppearance,
  ) => Promise<void>;
};
