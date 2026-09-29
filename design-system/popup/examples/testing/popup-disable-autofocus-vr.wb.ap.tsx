import { wb, type WorkbenchExample } from '@atlassian/workbench';

import PopupDisableAutofocusVrExample from '../popup-disable-autofocus-vr';

export const PopupDisableAutofocusVr: WorkbenchExample<typeof PopupDisableAutofocusVrExample> = wb(
	PopupDisableAutofocusVrExample,
);
