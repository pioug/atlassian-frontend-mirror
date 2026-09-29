import { wb, type WorkbenchExample } from '@atlassian/workbench';

import LockedSidebarExample from '../35-locked-sidebar';

export const LockedSidebar: WorkbenchExample<typeof LockedSidebarExample> =
	wb(LockedSidebarExample);
