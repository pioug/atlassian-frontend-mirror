import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingComboboxPopupInitialFocusExample from '../151-testing-combobox-popup-initial-focus';

export const TestingComboboxPopupInitialFocus: WorkbenchExample<
	typeof TestingComboboxPopupInitialFocusExample
> = wb(TestingComboboxPopupInitialFocusExample);
