import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingTopLayerFocusInMenuExample from '../testing-top-layer-focus-in-menu';

export const TestingTopLayerFocusInMenu: WorkbenchExample<
	typeof TestingTopLayerFocusInMenuExample
> = wb(TestingTopLayerFocusInMenuExample);
