import type { ACTION, ACTION_SUBJECT, INPUT_METHOD } from './enums';
import type { UIAEP, TrackAEP } from './utils';

export type BlockMenuOpenedAEP = UIAEP<
	ACTION.OPENED,
	ACTION_SUBJECT.BLOCK_MENU,
	undefined,
	{ inputMethod: INPUT_METHOD.MOUSE | INPUT_METHOD.KEYBOARD },
	undefined
>;

export type BlockMenuItemClickedAEP = UIAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.BLOCK_MENU_ITEM,
	undefined,
	{
		inputMethod: INPUT_METHOD.MOUSE | INPUT_METHOD.KEYBOARD;
		menuItemName: string;
	},
	undefined
>;

interface ElementConvertedAttr {
	conversionSource?: string; // will be used to define if the original node had content, expample value: 'emptyLine'
	eventCategory?: 'blockNodeInserted' | 'listInserted' | 'listConverted' | 'textFormatted'; // conversion type to match existing analytics events
	from: string;
	inputMethod: INPUT_METHOD.MOUSE | INPUT_METHOD.KEYBOARD; // input method type (keyboard or mouse)
	to: string;
	triggeredFrom: INPUT_METHOD.BLOCK_MENU; // UI component from which the action was triggered (block menu or toolbar)
}

type ElementConvertedAEP = TrackAEP<
	ACTION.CONVERTED,
	ACTION_SUBJECT.ELEMENT,
	undefined,
	ElementConvertedAttr,
	undefined
>;

export type BlockMenuEventPayload =
	| BlockMenuOpenedAEP
	| BlockMenuItemClickedAEP
	| ElementConvertedAEP;
