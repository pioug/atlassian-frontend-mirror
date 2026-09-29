import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DrawerFocusToRefOnCloseExample from '../12-drawer-focus-to-ref-on-close';

export const DrawerFocusToRefOnClose: WorkbenchExample<typeof DrawerFocusToRefOnCloseExample> = wb(
	DrawerFocusToRefOnCloseExample,
);
