import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingTopLayerMenuFocusReturnExample from '../testing-top-layer-menu-focus-return';

export const TestingTopLayerMenuFocusReturn: WorkbenchExample<
	typeof TestingTopLayerMenuFocusReturnExample
> = wb(TestingTopLayerMenuFocusReturnExample);
