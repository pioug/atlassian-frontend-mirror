import { wb, type WorkbenchExample } from '@atlassian/workbench';

import GiveKudosLauncherExample from '../01-giveKudosLauncher';

export const GiveKudosLauncher: WorkbenchExample<typeof GiveKudosLauncherExample> =
	wb(GiveKudosLauncherExample);
