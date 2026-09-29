import { wb, type WorkbenchExample } from '@atlassian/workbench';

import VcObserverPlaceholderExample from '../03-vc-observer-placeholder';

export const VcObserverPlaceholder: WorkbenchExample<typeof VcObserverPlaceholderExample> = wb(
	VcObserverPlaceholderExample,
);
