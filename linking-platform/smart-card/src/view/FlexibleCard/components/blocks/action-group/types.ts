import { type Appearance } from '@atlaskit/button';

import { type SmartLinkDirection, type SmartLinkSize } from '../../../../../constants';
import { type ActionItem } from '../types';

export type ActionGroupProps = {
	/**
	 * Determines the actions within the Action Group.
	 */
	items: ActionItem[];

	/**
	 * Determines the default size of the actions within the Action Group.
	 */
	size?: SmartLinkSize;

	/**
	 * Determines the direction that the actions are rendered. Can be vertical
	 * or horizontal.
	 */
	direction?: SmartLinkDirection;

	/**
	 * Determines the default appearance of the Action Group.
	 */
	appearance?: Appearance;

	/**
	 * Determines the maximum number of singular actions that should be rendered
	 * before collapsing all actions into a Dropdown.
	 */
	visibleButtonsNum?: number;

	/**
	 * Called when the action dropdown menu (if present) is open/closed.
	 */
	onDropdownOpenChange?: (isOpen: boolean) => void;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;
};
