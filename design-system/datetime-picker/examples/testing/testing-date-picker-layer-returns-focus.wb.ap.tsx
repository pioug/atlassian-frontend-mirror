import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDatePickerLayerReturnsFocusExample from '../testing-date-picker-layer-returns-focus';

export const TestingDatePickerLayerReturnsFocus: WorkbenchExample<
	typeof TestingDatePickerLayerReturnsFocusExample
> = wb(TestingDatePickerLayerReturnsFocusExample);
