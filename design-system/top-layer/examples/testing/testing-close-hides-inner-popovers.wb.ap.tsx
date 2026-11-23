import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingCloseHidesInnerPopoversExample from '../175-testing-close-hides-inner-popovers';

export const TestingCloseHidesInnerPopovers: WorkbenchExample<
	typeof TestingCloseHidesInnerPopoversExample
> = wb(TestingCloseHidesInnerPopoversExample);
