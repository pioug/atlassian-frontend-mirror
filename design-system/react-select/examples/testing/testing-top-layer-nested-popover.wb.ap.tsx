import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingTopLayerNestedPopoverExample from '../testing-top-layer-nested-popover';

export const TestingTopLayerNestedPopover: WorkbenchExample<
	typeof TestingTopLayerNestedPopoverExample
> = wb(TestingTopLayerNestedPopoverExample);
