import { wb, type WorkbenchExample } from '@atlassian/workbench';

import NonInteractiveAvatarGroupExample from '../02-non-interactive-avatar-group';

export const NonInteractiveAvatarGroup: WorkbenchExample<typeof NonInteractiveAvatarGroupExample> =
	wb(NonInteractiveAvatarGroupExample);
