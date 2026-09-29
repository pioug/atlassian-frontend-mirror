import { wb, type WorkbenchExample } from '@atlassian/workbench';

import FlagKeyboardDismissFromInputExample from '../22-flag-keyboard-dismiss-from-input';

export const FlagKeyboardDismissFromInput: WorkbenchExample<
	typeof FlagKeyboardDismissFromInputExample
> = wb(FlagKeyboardDismissFromInputExample);
