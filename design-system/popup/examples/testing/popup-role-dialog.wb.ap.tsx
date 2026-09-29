import { wb, type WorkbenchExample } from '@atlassian/workbench';

import PopupRoleDialogExample from '../19-popup-role-dialog.vr.ap';

export const PopupRoleDialog: WorkbenchExample<typeof PopupRoleDialogExample> =
	wb(PopupRoleDialogExample);
