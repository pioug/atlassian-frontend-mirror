import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopoverOverlapExample from '../171-testing-popover-overlap';

/**
 * Registers the query-configurable overlap fixture in Workbench.
 */
export const TestingPopoverOverlap: WorkbenchExample<typeof TestingPopoverOverlapExample> = wb(
	TestingPopoverOverlapExample,
);
