import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DropdownTriggerFocusClickOutsideExample from '../30-dropdown-trigger-focus-click-outside';

export const DropdownTriggerFocusClickOutside: WorkbenchExample<
	typeof DropdownTriggerFocusClickOutsideExample
> = wb(DropdownTriggerFocusClickOutsideExample);
