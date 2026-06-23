import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';

export type TransfromNodeTargetType =
	| 'heading1'
	| 'heading2'
	| 'heading3'
	| 'heading4'
	| 'heading5'
	| 'heading6'
	| 'paragraph'
	| 'blockquote'
	| 'expand'
	| 'layoutSection'
	| 'panel'
	| 'panel_c1'
	| 'codeBlock'
	| 'bulletList'
	| 'orderedList'
	| 'taskList'
	| 'decisionList';

export type TransformNodeMetadata = {
	inputMethod: INPUT_METHOD.BLOCK_MENU;
	isSuggested?: boolean;
	targetAttrs?: Record<string, unknown>;
	targetTypeName: TransfromNodeTargetType;
	triggeredFrom: INPUT_METHOD.MOUSE | INPUT_METHOD.KEYBOARD;
};
