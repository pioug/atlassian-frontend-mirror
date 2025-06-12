import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { UIAEP } from './utils';

type FloatingToolbarOverflowActionType = ACTION.CLICKED;
type FloatingToolbarOverflowSubjectType = ACTION_SUBJECT.BUTTON;
type FloatingToolbarOverflowSubjectIdType = ACTION_SUBJECT_ID.FLOATING_TOOLBAR_OVERFLOW;
type FloatingToolbarOverflowAttributeType = {
	editorContentMode?: 'edit' | 'view';
};

type FloatingToolbarOverflowUIAEP = UIAEP<
	FloatingToolbarOverflowActionType,
	FloatingToolbarOverflowSubjectType,
	FloatingToolbarOverflowSubjectIdType,
	FloatingToolbarOverflowAttributeType,
	undefined
>;
export type FloatingToolbarOverflowEventPayload = FloatingToolbarOverflowUIAEP;
