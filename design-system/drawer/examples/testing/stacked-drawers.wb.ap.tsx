import { wb, type WorkbenchExample } from '@atlassian/workbench';

import StackedDrawersExample from '../40-stacked-drawers.vr.ap';

export const StackedDrawers: WorkbenchExample<typeof StackedDrawersExample> =
	wb(StackedDrawersExample);
