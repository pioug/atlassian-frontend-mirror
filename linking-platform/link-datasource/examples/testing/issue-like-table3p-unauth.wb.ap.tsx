import { wb, type WorkbenchExample } from '@atlassian/workbench';

import IssueLikeTable3pUnauthExample from '../issue-like-table-3p-unauth.vr.ap';

export const IssueLikeTable3pUnauth: WorkbenchExample<typeof IssueLikeTable3pUnauthExample> = wb(
	IssueLikeTable3pUnauthExample,
);
