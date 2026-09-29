import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicAvatarGroupExample from '../02-basic-avatar-group.vr.ap';

export const BasicAvatarGroup: WorkbenchExample<typeof BasicAvatarGroupExample> =
	wb(BasicAvatarGroupExample);
