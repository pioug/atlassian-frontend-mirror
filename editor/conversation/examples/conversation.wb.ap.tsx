import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as NewConversationExample } from './0-New-Conversation';
import { default as ExistingConversationExample } from './1-Existing-Conversation';
import { default as ExistingMediaConversationExample } from './1-Existing-Media-Conversation';
import { default as CustomizedEditorExample } from './2-Customized-Editor';
import { default as MockProviderExample } from './3-Mock-Provider';
import { default as RealProviderExample } from './4-Real-Provider';
import { default as AdditionalCommentActionsExample } from './5-Additional-Comment-Actions';
import { default as MaxCommentNestingExample } from './6-Max-Comment-Nesting';

export const NewConversation: WorkbenchExample<typeof NewConversationExample> =
	wb(NewConversationExample);
export const ExistingConversation: WorkbenchExample<typeof ExistingConversationExample> = wb(
	ExistingConversationExample,
);
export const ExistingMediaConversation: WorkbenchExample<typeof ExistingMediaConversationExample> =
	wb(ExistingMediaConversationExample);
export const CustomizedEditor: WorkbenchExample<typeof CustomizedEditorExample> =
	wb(CustomizedEditorExample);
export const MockProvider: WorkbenchExample<typeof MockProviderExample> = wb(MockProviderExample);
export const RealProvider: WorkbenchExample<typeof RealProviderExample> = wb(RealProviderExample);
export const AdditionalCommentActions: WorkbenchExample<typeof AdditionalCommentActionsExample> =
	wb(AdditionalCommentActionsExample);
export const MaxCommentNesting: WorkbenchExample<typeof MaxCommentNestingExample> =
	wb(MaxCommentNestingExample);
