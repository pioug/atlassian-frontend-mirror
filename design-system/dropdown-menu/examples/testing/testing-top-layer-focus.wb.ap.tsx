import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingTopLayerFocusExample from '../testing-top-layer-focus';

export const TestingTopLayerFocus: WorkbenchExample<typeof TestingTopLayerFocusExample> = wb(
	TestingTopLayerFocusExample,
);
