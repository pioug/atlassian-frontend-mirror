import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { TrackAEP, OperationalAEP } from './utils';

export type UserPreferencesInitialisedAEP = OperationalAEP<
	ACTION.INITIALISED,
	ACTION_SUBJECT.USER_PREFERENCES,
	ACTION_SUBJECT_ID.SELECTION_TOOLBAR_PREFERENCES,
	{
		toolbarDocking: string | null;
	}
>;

export type UserPreferencesUpdatedAEP = TrackAEP<
	ACTION.UPDATED,
	ACTION_SUBJECT.USER_PREFERENCES,
	ACTION_SUBJECT_ID.SELECTION_TOOLBAR_PREFERENCES,
	{
		toolbarDocking: string | null;
	},
	undefined
>;

export type SelectionToolbarEventPayload =
	| UserPreferencesInitialisedAEP
	| UserPreferencesUpdatedAEP;
