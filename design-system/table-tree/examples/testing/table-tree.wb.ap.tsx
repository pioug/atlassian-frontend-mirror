import { wb, type WorkbenchExample } from '@atlassian/workbench';

import LoadingNestedExample from '../loading-nested';

export const LoadingNested: WorkbenchExample<typeof LoadingNestedExample> =
	wb(LoadingNestedExample);
