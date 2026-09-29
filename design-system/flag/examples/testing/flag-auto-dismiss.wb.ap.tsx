import { wb, type WorkbenchExample } from '@atlassian/workbench';

import FlagAutoDismissExample from '../10-flag-auto-dismiss';

export const FlagAutoDismiss: WorkbenchExample<typeof FlagAutoDismissExample> =
	wb(FlagAutoDismissExample);
