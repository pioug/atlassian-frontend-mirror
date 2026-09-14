import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { Node } from '@atlaskit/editor-prosemirror/model';

import type { TargetNodeMarks } from './transform-node-utils/types';

export type TransformNodeMarkChanges = {
	marksToAdd?: TargetNodeMarks;
	marksToRemove?: string[];
};

export type TransfromNodeTargetType =
	| 'heading1'
	| 'heading2'
	| 'heading3'
	| 'heading4'
	| 'heading5'
	| 'heading6'
	| 'paragraph'
	| 'smallText'
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

export type TransformNodeMetadata = TransformNodeMarkChanges & {
	inputMethod: INPUT_METHOD.BLOCK_MENU;
	isSuggested?: boolean;
	targetAttrs?: Record<string, unknown>;
	targetTypeName: TransfromNodeTargetType;
	triggeredFrom: INPUT_METHOD.MOUSE | INPUT_METHOD.KEYBOARD;
};

export type TransformInlineNodeMetadata = {
	buildInlineNode: (source: Node) => Node;
	isSuggested?: boolean;
	targetTypeName: string;
};
