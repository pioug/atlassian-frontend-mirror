import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDefaultOpenComboboxTriggerExample from '../96-testing-default-open-combobox-trigger';

export const TestingDefaultOpenComboboxTrigger: WorkbenchExample<
	typeof TestingDefaultOpenComboboxTriggerExample
> = wb(TestingDefaultOpenComboboxTriggerExample);
