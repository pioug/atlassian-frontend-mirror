import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingLayerShowOrderExample from '../170-testing-layer-show-order';

export const TestingLayerShowOrder: WorkbenchExample<typeof TestingLayerShowOrderExample> = wb(
	TestingLayerShowOrderExample,
);
