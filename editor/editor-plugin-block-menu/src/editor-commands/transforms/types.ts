import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { TransformContext } from '@atlaskit/editor-common/transforms';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

export type FormatNodeTargetType =
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
	| 'codeBlock'
	| 'bulletList'
	| 'orderedList'
	| 'taskList';

export type FormatNodeAnalyticsAttrs = {
	inputMethod: INPUT_METHOD.MOUSE | INPUT_METHOD.KEYBOARD;
	triggeredFrom: INPUT_METHOD.BLOCK_MENU;
};

export type TransformFunction = (context: TransformContext) => Transaction | null;
