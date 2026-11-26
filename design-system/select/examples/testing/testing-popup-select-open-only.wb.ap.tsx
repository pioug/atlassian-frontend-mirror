import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopupSelectOpenOnlyExample from '../100-testing-popup-select-open-only';

export const TestingPopupSelectOpenOnly: WorkbenchExample<
	typeof TestingPopupSelectOpenOnlyExample
> = wb(TestingPopupSelectOpenOnlyExample);
