import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingShowBeforeContentEffectsExample from '../171-testing-show-before-content-effects';

export const TestingShowBeforeContentEffects: WorkbenchExample<
	typeof TestingShowBeforeContentEffectsExample
> = wb(TestingShowBeforeContentEffectsExample);
