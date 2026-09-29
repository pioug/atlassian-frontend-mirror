import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ToggleHiddenElementExample from '../01-toggle-hidden-element';

export const ToggleHiddenElement: WorkbenchExample<typeof ToggleHiddenElementExample> = wb(
	ToggleHiddenElementExample,
);
