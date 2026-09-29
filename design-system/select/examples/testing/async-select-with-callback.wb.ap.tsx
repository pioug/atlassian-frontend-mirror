import { wb, type WorkbenchExample } from '@atlassian/workbench';

import AsyncSelectWithCallbackExample from '../06-async-select-with-callback';

export const AsyncSelectWithCallback: WorkbenchExample<typeof AsyncSelectWithCallbackExample> = wb(
	AsyncSelectWithCallbackExample,
);
