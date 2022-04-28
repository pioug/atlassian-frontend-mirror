import { SmartLinkSize, SmartLinkDirection } from '../../../../../constants';
import { ActionItem } from '../types';
import { Appearance } from '@atlaskit/button';

export type ActionGroupProps = {
  /* Determines the actions within the Action Group. */
  items: ActionItem[];
  /* Determines the default size of the actions within the Action Group. */
  size?: SmartLinkSize;
  /* Determines the direction that the actions are rendered. Can be Vertical or Horizontal. */
  direction?: SmartLinkDirection;
  /* Determines the default appearance of the Action Group. */
  appearance?: Appearance;
  /* Determines the maximum number of singular actions that should be rendered before collapsing all actions into a Dropdown. */
  visibleButtonsNum?: number;
  /* Callback used by the dropdown. Is called when the dropdown is opened. */
  onDropdownOpenChange?: (isOpen: boolean) => void;
  testId?: string;
};
