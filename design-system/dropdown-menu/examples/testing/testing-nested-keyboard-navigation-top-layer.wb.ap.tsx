import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingNestedKeyboardNavigationTopLayerExample from '../93-testing-nested-keyboard-navigation-top-layer';

export const TestingNestedKeyboardNavigationTopLayer: WorkbenchExample<
	typeof TestingNestedKeyboardNavigationTopLayerExample
> = wb(TestingNestedKeyboardNavigationTopLayerExample);
