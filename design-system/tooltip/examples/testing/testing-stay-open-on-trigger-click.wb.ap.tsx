import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingStayOpenOnTriggerClickExample from '../testing-stay-open-on-trigger-click';

export const TestingStayOpenOnTriggerClick: WorkbenchExample<
	typeof TestingStayOpenOnTriggerClickExample
> = wb(TestingStayOpenOnTriggerClickExample);
