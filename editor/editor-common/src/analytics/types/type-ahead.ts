import type { TypeAheadAvailableNodes } from '../../type-ahead';

import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, INPUT_METHOD } from './enums';
import type { OperationalAEP, UIAEP } from './utils';

type TypeAheadRenderedAEP = OperationalAEP<
	ACTION.RENDERED,
	ACTION_SUBJECT.TYPEAHEAD,
	undefined,
	{
		time?: number;
		items?: number;
		initial?: boolean;
	}
>;

type TypeAheadItemViewedAEP = OperationalAEP<
	ACTION.VIEWED,
	ACTION_SUBJECT.TYPEAHEAD_ITEM,
	undefined,
	{
		index?: number;
		items?: number;
	}
>;

type TypeAheadAEP<ActionSubjectID, Attributes> = UIAEP<
	ACTION.INVOKED,
	ACTION_SUBJECT.TYPEAHEAD,
	ActionSubjectID,
	Attributes,
	undefined
>;

type TypeAheadEmojiAEP = TypeAheadAEP<
	ACTION_SUBJECT_ID.TYPEAHEAD_EMOJI | TypeAheadAvailableNodes.EMOJI,
	{
		inputMethod:
			| INPUT_METHOD.TOOLBAR
			| INPUT_METHOD.INSERT_MENU
			| INPUT_METHOD.QUICK_INSERT
			| INPUT_METHOD.KEYBOARD
			/**
			 * For Typeahead - Empty line prompt experiment
			 * Clean up ticket ED-24824
			 */
			| 'blockControl';
	}
>;

type TypeAheadLinkAEP = TypeAheadAEP<
	ACTION_SUBJECT_ID.TYPEAHEAD_LINK,
	{
		inputMethod:
			| INPUT_METHOD.TOOLBAR
			| INPUT_METHOD.INSERT_MENU
			| INPUT_METHOD.QUICK_INSERT
			| INPUT_METHOD.SHORTCUT
			| INPUT_METHOD.FLOATING_TB
			/**
			 * For Typeahead - Empty line prompt experiment
			 * Clean up ticket ED-24824
			 */
			| 'blockControl';
	}
>;

type TypeAheadMentionAEP = TypeAheadAEP<
	ACTION_SUBJECT_ID.TYPEAHEAD_MENTION | TypeAheadAvailableNodes.MENTION,
	{
		inputMethod:
			| INPUT_METHOD.TOOLBAR
			| INPUT_METHOD.INSERT_MENU
			| INPUT_METHOD.QUICK_INSERT
			| INPUT_METHOD.KEYBOARD
			/**
			 * For Typeahead - Empty line prompt experiment
			 * Clean up ticket ED-24824
			 */
			| 'blockControl';
	}
>;

type TypeAheadQuickInsertAEP = TypeAheadAEP<
	ACTION_SUBJECT_ID.TYPEAHEAD_QUICK_INSERT | TypeAheadAvailableNodes.QUICK_INSERT,
	{
		inputMethod:
			| INPUT_METHOD.TOOLBAR
			| INPUT_METHOD.INSERT_MENU
			| INPUT_METHOD.QUICK_INSERT
			| INPUT_METHOD.KEYBOARD
			/**
			 * For Typeahead - Empty line prompt experiment
			 * Clean up ticket ED-24824
			 */
			| 'blockControl';
	}
>;

export type TypeAheadPayload =
	| TypeAheadEmojiAEP
	| TypeAheadLinkAEP
	| TypeAheadMentionAEP
	| TypeAheadQuickInsertAEP
	| TypeAheadRenderedAEP
	| TypeAheadItemViewedAEP;

export type EventInput = 'keyboard' | 'mouse' | 'floatingToolBar';
