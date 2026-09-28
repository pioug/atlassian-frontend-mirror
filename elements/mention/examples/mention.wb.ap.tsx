import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SimpleMentionItemVrApExample from './00-simple-mention-item.vr.ap';
import MentionItemVrApExample from './01-mention-item.vr.ap';
import MentionListExample from './02-mention-list';
import ErrorMentionListVrApExample from './03-error-mention-list.vr.ap';
import ResourcedMentionListExample from './04-resourced-mention-list';
import MentionListPickerExample from './05-mention-list-picker';
import MentionListPickerWithSlowProvidersExample from './06-mention-list-picker-with-slow-providers';
import SimpleMentionVrApExample from './07-simple-mention.vr.ap';
import ResourcedMentionOnN20BackgroundExample from './08-resourced-mention-on-n20-background';
import MentionPickerExternalAsapExample from './09-mention-picker-external-asap';
import MentionPickerExternalCookieExample from './10-mention-picker-external-cookie';
import MentionItemWithAgentVrApExample from './11-mention-item-with-agent.vr.ap';
import MentionItemLoadingExample from './12-mention-item-loading';
import MentionWithTeamPickerExternalCookieExample from './13-mention-with-team-picker-external-cookie';
import MentionWithEditorExtendingAbstractMentionResourceExample from './14-mention-with-editor-extending-abstract-mention-resource';
import SimpleMentionListVrApExample from './simple-mention-list.vr.ap';

export const SimpleMentionItemVrAp: WorkbenchExample<typeof SimpleMentionItemVrApExample> = wb(
	SimpleMentionItemVrApExample,
);
export const MentionItemVrAp: WorkbenchExample<typeof MentionItemVrApExample> =
	wb(MentionItemVrApExample);
export const MentionList: WorkbenchExample<typeof MentionListExample> = wb(MentionListExample);
export const ErrorMentionListVrAp: WorkbenchExample<typeof ErrorMentionListVrApExample> = wb(
	ErrorMentionListVrApExample,
);
export const ResourcedMentionList: WorkbenchExample<typeof ResourcedMentionListExample> = wb(
	ResourcedMentionListExample,
);
export const MentionListPicker: WorkbenchExample<typeof MentionListPickerExample> =
	wb(MentionListPickerExample);
export const MentionListPickerWithSlowProviders: WorkbenchExample<
	typeof MentionListPickerWithSlowProvidersExample
> = wb(MentionListPickerWithSlowProvidersExample);
export const SimpleMentionVrAp: WorkbenchExample<typeof SimpleMentionVrApExample> =
	wb(SimpleMentionVrApExample);
export const ResourcedMentionOnN20Background: WorkbenchExample<
	typeof ResourcedMentionOnN20BackgroundExample
> = wb(ResourcedMentionOnN20BackgroundExample);
export const MentionPickerExternalAsap: WorkbenchExample<typeof MentionPickerExternalAsapExample> =
	wb(MentionPickerExternalAsapExample);
export const MentionPickerExternalCookie: WorkbenchExample<
	typeof MentionPickerExternalCookieExample
> = wb(MentionPickerExternalCookieExample);
export const MentionItemWithAgentVrAp: WorkbenchExample<typeof MentionItemWithAgentVrApExample> =
	wb(MentionItemWithAgentVrApExample);
export const MentionItemLoading: WorkbenchExample<typeof MentionItemLoadingExample> =
	wb(MentionItemLoadingExample);
export const MentionWithTeamPickerExternalCookie: WorkbenchExample<
	typeof MentionWithTeamPickerExternalCookieExample
> = wb(MentionWithTeamPickerExternalCookieExample);
export const MentionWithEditorExtendingAbstractMentionResource: WorkbenchExample<
	typeof MentionWithEditorExtendingAbstractMentionResourceExample
> = wb(MentionWithEditorExtendingAbstractMentionResourceExample);
export const SimpleMentionListVrAp: WorkbenchExample<typeof SimpleMentionListVrApExample> = wb(
	SimpleMentionListVrApExample,
);
