import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingHintNoCloseAutoExample from '../139-testing-hint-no-close-auto';

export const TestingHintNoCloseAuto: WorkbenchExample<typeof TestingHintNoCloseAutoExample> = wb(
	TestingHintNoCloseAutoExample,
);
