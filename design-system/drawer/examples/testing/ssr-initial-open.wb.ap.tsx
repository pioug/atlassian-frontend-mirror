import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SsrInitialOpenExample from '../97-ssr-initial-open';

export const SsrInitialOpen: WorkbenchExample<typeof SsrInitialOpenExample> =
	wb(SsrInitialOpenExample);
