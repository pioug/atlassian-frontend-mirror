import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SsrInitialOpenExample from '../103-ssr-initial-open.vr.ap';

export const SsrInitialOpen: WorkbenchExample<typeof SsrInitialOpenExample> =
	wb(SsrInitialOpenExample);
