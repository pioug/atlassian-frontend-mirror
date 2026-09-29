import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DefaultDropdownMenuExample from '../01-default-dropdown-menu';

export const DefaultDropdownMenu: WorkbenchExample<typeof DefaultDropdownMenuExample> = wb(
	DefaultDropdownMenuExample,
);
