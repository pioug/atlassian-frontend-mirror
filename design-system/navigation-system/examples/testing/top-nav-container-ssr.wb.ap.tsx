import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TopNavContainerSsrExample from '../top-nav-container-ssr';

export const TopNavContainerSsr: WorkbenchExample<typeof TopNavContainerSsrExample> =
	wb(TopNavContainerSsrExample);
