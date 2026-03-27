import type { ACTION_SUBJECT_ID, INPUT_METHOD } from './enums';
import type { InsertAEP } from './utils';

export type InputMethodInsertNativeEmbed =
	| INPUT_METHOD.CLIPBOARD
	| INPUT_METHOD.AUTO_DETECT
	| INPUT_METHOD.TYPEAHEAD
	| INPUT_METHOD.MANUAL
	| INPUT_METHOD.FORMATTING
	| INPUT_METHOD.FLOATING_TB;

export type InsertNativeEmbedAEP = InsertAEP<
	ACTION_SUBJECT_ID.NATIVE_EMBED,
	{
		inputMethod: InputMethodInsertNativeEmbed;
		insertedCount: number;
	},
	undefined
>;
