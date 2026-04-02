import type { ACTION, ACTION_SUBJECT, INPUT_METHOD } from './enums';
import type { TrackAEP } from './utils';

export type InputMethodInsertNativeEmbed =
	| INPUT_METHOD.CLIPBOARD
	| INPUT_METHOD.AUTO_DETECT
	| INPUT_METHOD.TYPEAHEAD
	| INPUT_METHOD.MANUAL
	| INPUT_METHOD.FORMATTING
	| INPUT_METHOD.FLOATING_TB;

export type InsertNativeEmbedAEP = TrackAEP<
	ACTION.INSERTED,
	ACTION_SUBJECT.NATIVE_EMBED,
	undefined,
	{
		inputMethod: InputMethodInsertNativeEmbed;
		insertedCount: number;
	},
	undefined
>;
