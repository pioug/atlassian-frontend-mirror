import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TeamContainersExample from '../TeamContainers.example';

export const TeamContainers: WorkbenchExample<typeof TeamContainersExample> =
	wb(TeamContainersExample);
