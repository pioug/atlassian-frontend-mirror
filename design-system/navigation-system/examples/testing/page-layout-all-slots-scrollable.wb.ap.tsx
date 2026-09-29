import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as PageLayoutAllSlotsScrollableExample } from '../page-layout-all-slots-scrollable';

export const PageLayoutAllSlotsScrollable: WorkbenchExample<
	typeof PageLayoutAllSlotsScrollableExample
> = wb(PageLayoutAllSlotsScrollableExample);
