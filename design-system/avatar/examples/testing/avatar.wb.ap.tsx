import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicAvatarItemExample from '../03-basic-avatar-item.vr.ap';

export const BasicAvatarItem: WorkbenchExample<typeof BasicAvatarItemExample> =
	wb(BasicAvatarItemExample);
