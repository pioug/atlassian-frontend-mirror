import { SmartLinkSize, SmartLinkDirection } from '../../../../../constants';
import { ActionItem } from '../types';

export type ActionGroupProps = {
  items: ActionItem[];
  size?: SmartLinkSize;
  direction?: SmartLinkDirection;
  testId?: string;
};
