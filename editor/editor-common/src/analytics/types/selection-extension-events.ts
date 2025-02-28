import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { TrackAEP } from './utils';
type SelectionExtensionActionType = ACTION.VIEWED | ACTION.CLICKED | ACTION.CLOSED;
type SelectionExtensionSubjectType =
	| ACTION_SUBJECT.BUTTON
	| ACTION_SUBJECT.EDITOR_PLUGIN_SELECTION_EXTENSION;
type SelectionExtensionSubjectIdType =
	| ACTION_SUBJECT_ID.EDITOR_PLUGIN_SELECTION_EXTENSION_DROPDOWN
	| ACTION_SUBJECT_ID.EDITOR_PLUGIN_SELECTION_EXTENSION_COMPONENT
	| ACTION_SUBJECT_ID.EDITOR_PLUGIN_SELECTION_EXTENSION_ITEM;
type SelectionExtensionAttributeType = {
	toggle: ACTION.OPENED | ACTION.CLOSED;
};
type SelectionExtensionAEP = TrackAEP<
	SelectionExtensionActionType,
	SelectionExtensionSubjectType,
	SelectionExtensionSubjectIdType,
	SelectionExtensionAttributeType,
	undefined
>;
export type SelectionExtensionEventPayload = SelectionExtensionAEP;
