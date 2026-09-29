import { wb, type WorkbenchExample } from '@atlassian/workbench';

import MentionWithEditorExample from '../14-mention-with-editor-extending-abstract-mention-resource';

export const MentionWithEditorExtendingAbstractMentionResource: WorkbenchExample<
	typeof MentionWithEditorExample
> = wb(MentionWithEditorExample);
