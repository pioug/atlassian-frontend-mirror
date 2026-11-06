import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicTagExample from '../0-basic-tag';
import KeyboardFocusExample from '../keyboard-focus';

export const BasicTag: WorkbenchExample<typeof BasicTagExample> = wb(BasicTagExample);

export const KeyboardFocus: WorkbenchExample<typeof KeyboardFocusExample> =
	wb(KeyboardFocusExample);
