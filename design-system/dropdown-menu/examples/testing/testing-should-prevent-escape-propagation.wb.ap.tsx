import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingShouldPreventEscapePropagationExample from '../88-testing-should-prevent-escape-propagation';

export const TestingShouldPreventEscapePropagation: WorkbenchExample<
	typeof TestingShouldPreventEscapePropagationExample
> = wb(TestingShouldPreventEscapePropagationExample);
