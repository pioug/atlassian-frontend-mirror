import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DrawerDefaultExample from '../02-drawer-default.vr.ap';

export const DrawerDefault: WorkbenchExample<typeof DrawerDefaultExample> =
	wb(DrawerDefaultExample);
