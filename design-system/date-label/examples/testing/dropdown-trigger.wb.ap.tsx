import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DropdownTriggerExample from '../4-dropdown-trigger.vr.ap';

export const DropdownTrigger: WorkbenchExample<typeof DropdownTriggerExample> =
	wb(DropdownTriggerExample);
