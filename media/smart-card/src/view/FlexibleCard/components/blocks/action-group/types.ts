import { SmartLinkSize, SmartLinkDirection } from '../../../../../constants';
import { ActionItem } from '../types';
import { Appearance } from '@atlaskit/button';

export type ActionGroupProps = {
  items: ActionItem[];
  size?: SmartLinkSize;
  direction?: SmartLinkDirection;
  testId?: string;
  appearance?: Appearance;
  visibleButtonsNum?: number;
  onDropdownOpenChange?: (isOpen: boolean) => void;
};
