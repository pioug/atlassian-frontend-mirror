import { wb, type WorkbenchExample } from '@atlassian/workbench';

import PopupDisableAutofocusExample from '../popup-disable-autofocus';

export const PopupDisableAutofocus: WorkbenchExample<typeof PopupDisableAutofocusExample> = wb(
	PopupDisableAutofocusExample,
);
