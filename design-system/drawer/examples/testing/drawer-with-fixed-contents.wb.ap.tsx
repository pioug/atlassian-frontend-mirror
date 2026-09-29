import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DrawerWithFixedContentsExample from '../20-drawer-with-fixed-contents';

export const DrawerWithFixedContents: WorkbenchExample<typeof DrawerWithFixedContentsExample> = wb(
	DrawerWithFixedContentsExample,
);
