import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TtaiWithTimersExample from '../07-ttai-with-timers';

export const TtaiWithTimers: WorkbenchExample<typeof TtaiWithTimersExample> =
	wb(TtaiWithTimersExample);
