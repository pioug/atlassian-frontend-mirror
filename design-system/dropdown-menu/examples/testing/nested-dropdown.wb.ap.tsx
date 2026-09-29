import { wb, type WorkbenchExample } from '@atlassian/workbench';

import NestedDropdownExample from '../12-nested-dropdown';

export const NestedDropdown: WorkbenchExample<typeof NestedDropdownExample> =
	wb(NestedDropdownExample);
