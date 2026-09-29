import { wb, type WorkbenchExample } from '@atlassian/workbench';

import WithIsSearchableFalseExample from '../07-with-isSearchable-false';

export const WithIsSearchableFalse: WorkbenchExample<typeof WithIsSearchableFalseExample> = wb(
	WithIsSearchableFalseExample,
);
