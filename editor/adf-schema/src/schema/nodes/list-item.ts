import { uuid } from '../../utils';
import {
	listItem as listItemFactory,
	listItemWithNestedDecisionStage0 as listItemWithNestedDecisionStage0Factory,
} from '../../next-schema/generated/nodeTypes';
import type {
	NodeSpec,
	AttributeSpec,
	Node,
	DOMOutputSpec,
	TagParseRule,
} from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

/**
 * @name list_item
 * @description this node allows task-list to be nested inside list-item
 */
export const listItem: NodeSpec = listItemFactory({
	parseDOM: [{ tag: 'li' }],
	toDOM() {
		return ['li', 0];
	},
});

export const listItemWithLocalId: NodeSpec = listItemFactory({
	parseDOM: [{ tag: 'li', getAttrs: () => ({ localId: uuid.generate() }) }],
	toDOM(node) {
		return ['li', { 'data-local-id': node?.attrs?.localId || undefined }, 0];
	},
});

/**
 * @name list_item_with_decision_stage0
 * @description this node allows decisions to be nested inside list-item
 */
const listItemWithDecisionStage0Spec = listItemWithNestedDecisionStage0Factory({
	parseDOM: [{ tag: 'li' }],
	toDOM() {
		return ['li', 0];
	},
});

// Allow list-first content while preserving decisionList support in stage0.
const listItemStage0Content =
	'((paragraph | mediaSingle | codeBlock | unsupportedBlock | decisionList | extension) (paragraph | bulletList | orderedList | taskList | mediaSingle | codeBlock | unsupportedBlock | decisionList | extension)*) | ((paragraph | bulletList | orderedList | taskList | mediaSingle | codeBlock | unsupportedBlock | extension)+)';

export const listItemWithDecisionStage0: {
	atom?: boolean;
	attrs?: {
		[name: string]: AttributeSpec;
	};
	code?: boolean;
	content: string;
	defining?: boolean;
	definingAsContext?: boolean;
	definingForContent?: boolean;
	disableDropCursor?:
		| boolean
		| ((
				view: EditorView,
				pos: {
					inside: number;
					pos: number;
				},
				event: DragEvent,
		  ) => boolean);
	draggable?: boolean;
	group?: string;
	inline?: boolean;
	isolating?: boolean;
	leafText?: (node: Node) => string;
	linebreakReplacement?: boolean;
	marks?: string;
	parseDOM?: readonly TagParseRule[];
	selectable?: boolean;
	toDebugString?: (node: Node) => string;
	toDOM?: (node: Node) => DOMOutputSpec;
	whitespace?: 'pre' | 'normal';
} = {
	...listItemWithDecisionStage0Spec,
	content: listItemStage0Content,
};

export const listItemWithNestedDecisionAndLocalIdStage0: NodeSpec =
	listItemWithNestedDecisionStage0Factory({
		parseDOM: [{ tag: 'li', getAttrs: () => ({ localId: uuid.generate() }) }],
		toDOM(node) {
			return ['li', { 'data-local-id': node?.attrs?.localId || undefined }, 0];
		},
	});
