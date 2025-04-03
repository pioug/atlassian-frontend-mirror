import { type ACTION, type ACTION_SUBJECT, type ACTION_SUBJECT_ID } from './enums';
import { type OperationalAEP } from './utils';

export type SelectionToolbarAEP = OperationalAEP<
	ACTION.INITIALISED,
	ACTION_SUBJECT.USER_PREFERENCES,
	ACTION_SUBJECT_ID.SELECTION_TOOLBAR_PREFERENCES,
	{
		toolbarDocking: string | null;
	}
>;

export type SelectionToolbarEventPayload = SelectionToolbarAEP;
