import { wb, type WorkbenchExample } from '@atlassian/workbench';

import IssueLikeTableExample from '../issue-like-table';

export const IssueLikeTable: WorkbenchExample<typeof IssueLikeTableExample> =
	wb(IssueLikeTableExample);
