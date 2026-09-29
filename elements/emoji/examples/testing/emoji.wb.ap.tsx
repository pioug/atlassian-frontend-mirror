import { wb, type WorkbenchExample } from '@atlassian/workbench';

import EmojiPickerInFormExample from '../27-emoji-picker-in-form';

export const EmojiPickerInForm: WorkbenchExample<typeof EmojiPickerInFormExample> =
	wb(EmojiPickerInFormExample);
