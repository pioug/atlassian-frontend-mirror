import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TextareaUsageExample from '../01-textarea-usage';

export const TextareaUsage: WorkbenchExample<typeof TextareaUsageExample> =
	wb(TextareaUsageExample);
