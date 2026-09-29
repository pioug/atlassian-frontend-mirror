import { wb, type WorkbenchExample } from '@atlassian/workbench';

import WithIssuesModalExample from '../with-issues-modal.vr.ap';

export const WithIssuesModal: WorkbenchExample<typeof WithIssuesModalExample> =
	wb(WithIssuesModalExample);
