import type { NodeType, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type EditorState, NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { findWrapping } from '@atlaskit/editor-prosemirror/transform';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';

import { removeBlockMarks } from './editor-core-utils';

/**
 * This function creates a new transaction that wraps the current selection
 * in the specified node type if it results in a valid transaction.
 * If not valid, it performs a safe insert operation.
 *
 * Example of when wrapping might not be valid is when attempting to wrap
 * content that is already inside a panel with another panel
 */
export function createWrapSelectionTransaction({
	state,
	type,
	nodeAttributes,
}: {
	state: EditorState;
	type: NodeType;
	// This should be the node attributes from the ADF schema where prosemirror attributes are specified
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	nodeAttributes?: Record<string, any>;
}) {
	let { tr } = state;
	const { alignment, indentation } = state.schema.marks;

	/** Alignment or Indentation is not valid inside block types */
	const removeAlignTr = removeBlockMarks(state, [alignment, indentation]);
	tr = removeAlignTr || tr;

	/**Get range and wrapping needed for the selection*/
	const { range, wrapping } = getWrappingOptions(state, type, nodeAttributes);
	if (wrapping) {
		tr.wrap(range, wrapping).scrollIntoView();
	} else {
		/** We always want to append a block type */
		safeInsert(type.createAndFill(nodeAttributes) as PMNode)(tr).scrollIntoView();
	}

	return tr;
}
export function getWrappingOptions(
	state: EditorState,
	type: NodeType,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	nodeAttributes?: Record<string, any>,
) {
	const { $from, $to, from } = state.selection;

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let range = $from.blockRange($to) as any;

	const isMediaSelection =
		state.selection instanceof NodeSelection &&
		state.selection.node.type === state.schema.nodes.media;

	/**
	 * To wrap a media group we need to start the range from one position
	 * before a media selection's from position.
	 */
	if (isMediaSelection) {
		const prev = from - 1;
		range = state.doc.resolve(from > 0 ? prev : from).blockRange($to);
	}

	let isAllowedChild = true;
	/**
	 * Added a check to avoid wrapping codeblock
	 */
	if (state.selection.empty) {
		state.doc.nodesBetween($from.pos, $to.pos, (node) => {
			if (!isAllowedChild) {
				return false;
			}
			return (isAllowedChild = node.type !== state.schema.nodes.codeBlock);
		});
	}
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const wrapping = isAllowedChild && range && (findWrapping(range, type, nodeAttributes) as any);
	return { range, wrapping };
}
