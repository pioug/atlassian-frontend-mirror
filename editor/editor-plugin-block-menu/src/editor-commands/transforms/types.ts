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

// TransformContext moved to @atlaskit/editor-common/transforms

export type TransformFunction = (context: TransformContext) => Transaction | null;
