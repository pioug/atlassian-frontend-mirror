import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPersistentInlineSelectPopoversExample from '../99-testing-persistent-inline-select-popovers';

export const TestingPersistentInlineSelectPopovers: WorkbenchExample<
	typeof TestingPersistentInlineSelectPopoversExample
> = wb(TestingPersistentInlineSelectPopoversExample);
