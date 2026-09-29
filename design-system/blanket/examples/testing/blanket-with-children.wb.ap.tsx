import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BlanketWithChildrenExample from '../03-blanket-with-children';

export const BlanketWithChildren: WorkbenchExample<typeof BlanketWithChildrenExample> = wb(
	BlanketWithChildrenExample,
);
