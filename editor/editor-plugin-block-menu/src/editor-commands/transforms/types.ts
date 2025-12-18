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
	| 'taskList'
	| 'decisionList';

export type TransfromNodeTargetType = FormatNodeTargetType;

export type FormatNodeAnalyticsAttrs = {
	inputMethod: INPUT_METHOD.BLOCK_MENU;
	triggeredFrom: INPUT_METHOD.MOUSE | INPUT_METHOD.KEYBOARD;
};

export type TransformNodeMetadata = FormatNodeAnalyticsAttrs & {
	targetAttrs?: Record<string, unknown>;
	targetTypeName: TransfromNodeTargetType;
};

export type TransformFunction = (context: TransformContext) => Transaction | null;
