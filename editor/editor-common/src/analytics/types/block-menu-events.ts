import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, INPUT_METHOD } from './enums';
import type { UIAEP, TrackAEP, OperationalAEP, SELECTION_TYPE } from './utils';

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
		menuItemName: string;
	},
	undefined
>;

interface ElementConvertedAttr {
	conversionSource?: string; // will be used to define if the original node had content, expample value: 'emptyLine'
	eventCategory?: 'blockNodeInserted' | 'listInserted' | 'listConverted' | 'textFormatted'; // conversion type to match existing analytics events
	from: string;
	inputMethod: INPUT_METHOD.BLOCK_MENU; // UI component from which the action was triggered (block menu or toolbar)
	to: string;
	triggeredFrom: INPUT_METHOD.MOUSE | INPUT_METHOD.KEYBOARD; // input method type (keyboard or mouse)
}

type ElementConvertedAEP = TrackAEP<
	ACTION.CONVERTED,
	ACTION_SUBJECT.ELEMENT,
	undefined,
	ElementConvertedAttr,
	undefined
>;

type SelectionJson = {
	anchor?: number;
	head?: number;
	pos?: number;
	type: SELECTION_TYPE;
};

interface ElementTransformErrorAttr {
	docSize: number;
	error: string;
	errorStack?: string;
	from: string;
	inputMethod: INPUT_METHOD.BLOCK_MENU;
	position: number;
	selection: SelectionJson;
	to: string;
	triggeredFrom: INPUT_METHOD.MOUSE | INPUT_METHOD.KEYBOARD;
}

export type ElementTransformErrorAEP = OperationalAEP<
	ACTION.ERRORED,
	ACTION_SUBJECT.ELEMENT,
	ACTION_SUBJECT_ID.TRANSFORM,
	ElementTransformErrorAttr
>;

interface ElementTransformPerformanceAttr {
	duration: number;
	isList: boolean;
	isNested: boolean;
	nodeCount: number;
	sourceNodeTypes: Record<string, number>;
	startTime: number;
	targetNodeType: string;
}

export type ElementTransformPerformanceAEP = OperationalAEP<
	ACTION.TRANSFORMED,
	ACTION_SUBJECT.ELEMENT,
	ACTION_SUBJECT_ID.TRANSFORM,
	ElementTransformPerformanceAttr
>;

export type BlockMenuEventPayload =
	| BlockMenuOpenedAEP
	| BlockMenuItemClickedAEP
	| ElementConvertedAEP
	| ElementTransformErrorAEP
	| ElementTransformPerformanceAEP;
