import type {
	MarkType,
	NodeType,
	Node as PMNode,
	ResolvedPos,
	Schema,
} from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

import type { HeadingLevelsAndNormalText } from '../types/block-type';
import type { Command } from '../types/command';

type AlignmentState = 'start' | 'end' | 'center';
export function addParagraphAtEnd(tr: Transaction) {
	const {
		doc: {
			type: {
				schema: {
					nodes: { paragraph },
				},
			},
		},
		doc,
	} = tr;
	if (doc.lastChild && !(doc.lastChild.type === paragraph && doc.lastChild.content.size === 0)) {
		if (paragraph) {
			tr.insert(doc.content.size, paragraph.createAndFill() as PMNode);
		}
	}
	tr.setSelection(TextSelection.create(tr.doc, tr.doc.content.size - 1));
	tr.scrollIntoView();
}

export function createParagraphAtEnd(): Command {
	return function (state, dispatch) {
		const { tr } = state;
		addParagraphAtEnd(tr);
		if (dispatch) {
			dispatch(tr);
		}
		return true;
	};
}

export const changeImageAlignment =
	(align?: AlignmentState): Command =>
	(state, dispatch) => {
		const { from, to } = state.selection;

		const tr = state.tr;

		state.doc.nodesBetween(from, to, (node, pos) => {
			if (node.type === state.schema.nodes.mediaSingle) {
				tr.setNodeMarkup(pos, undefined, {
					...node.attrs,
					layout: align === 'center' ? 'center' : `align-${align}`,
				});
			}
		});

		if (tr.docChanged && dispatch) {
			dispatch(tr.scrollIntoView());
			return true;
		}

		return false;
	};

export const createToggleBlockMarkOnRange =
	<T extends Object = object>(
		markType: MarkType,
		getAttrs: (prevAttrs?: T, node?: PMNode) => T | undefined | false,
		allowedBlocks?:
			| Array<NodeType>
			| ((schema: Schema, node: PMNode, parent: PMNode | null) => boolean),
	) =>
	(from: number, to: number, tr: Transaction, state: EditorState): boolean => {
		let markApplied = false;
		state.doc.nodesBetween(from, to, (node, pos, parent) => {
			if (!node.type.isBlock) {
				return false;
			}

			if (
				(!allowedBlocks ||
					(Array.isArray(allowedBlocks)
						? allowedBlocks.indexOf(node.type) > -1
						: allowedBlocks(state.schema, node, parent))) &&
				parent?.type.allowsMarkType(markType)
			) {
				const oldMarks = node.marks.filter((mark) => mark.type === markType);

				const prevAttrs = oldMarks.length ? (oldMarks[0].attrs as T) : undefined;
				const newAttrs = getAttrs(prevAttrs, node);

				if (newAttrs !== undefined) {
					tr.setNodeMarkup(
						pos,
						node.type,
						node.attrs,
						node.marks
							.filter((mark) => !markType.excludes(mark.type))
							.concat(newAttrs === false ? [] : markType.create(newAttrs)),
					);
					markApplied = true;
				}
			}
			return;
		});
		return markApplied;
	};

export const createToggleInlineMarkOnRange =
	<T extends Object = object>(
		markType: MarkType,
		getAttrs: (prevAttrs?: T, node?: PMNode) => T | undefined | false,
	) =>
	(from: number, to: number, tr: Transaction, state: EditorState): boolean => {
		let markApplied = false;
		state.doc.nodesBetween(from, to, (node, pos, parent) => {
			if (parent?.type.allowsMarkType(markType)) {
				const oldMarks = node.marks.filter((mark) => mark.type === markType);

				const prevAttrs = oldMarks.length ? (oldMarks[0].attrs as T) : undefined;
				const newAttrs = getAttrs(prevAttrs, node);

				if (newAttrs !== undefined) {
					tr.setNodeMarkup(
						pos,
						node.type,
						node.attrs,
						node.marks
							.filter((mark) => !markType.excludes(mark.type))
							.concat(newAttrs === false ? [] : markType.create(newAttrs)),
					);

					tr.setSelection(NodeSelection.create(tr.doc, state.selection.from));
					markApplied = true;
				}
			}
			return;
		});
		return markApplied;
	};

/**
 * Toggles block mark based on the return type of `getAttrs`.
 * This is similar to ProseMirror's `getAttrs` from `AttributeSpec`
 * return `false` to remove the mark.
 * return `undefined for no-op.
 * return an `object` to update the mark.
 */
export const toggleBlockMark =
	<T extends Object = object>(
		markType: MarkType,
		getAttrs: (prevAttrs?: T, node?: PMNode) => T | undefined | false,
		allowedBlocks?:
			| Array<NodeType>
			| ((schema: Schema, node: PMNode, parent: PMNode | null) => boolean),
	): Command =>
	(state, dispatch) => {
		let markApplied = false;
		const tr = state.tr;

		const toggleBlockMarkOnRange = createToggleBlockMarkOnRange(markType, getAttrs, allowedBlocks);

		if (state.selection instanceof CellSelection) {
			state.selection.forEachCell((cell, pos) => {
				markApplied = toggleBlockMarkOnRange(pos, pos + cell.nodeSize, tr, state);
			});
		} else {
			const { from, to } = state.selection;
			markApplied = toggleBlockMarkOnRange(from, to, tr, state);
		}

		if (markApplied && tr.docChanged) {
			if (dispatch) {
				dispatch(tr.scrollIntoView());
			}
			return true;
		}

		return false;
	};

export const clearEditorContent: Command = (state, dispatch) => {
	const tr = state.tr;
	tr.replace(0, state.doc.nodeSize - 2);
	tr.setSelection(Selection.atStart(tr.doc));

	if (dispatch) {
		dispatch(tr);
		return true;
	}

	return false;
};

// https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js#L90
// Keep going left up the tree, without going across isolating boundaries, until we
// can go along the tree at that same level
//
// You can think of this as, if you could construct each document like we do in the tests,
// return the position of the first ) backwards from the current selection.
export function findCutBefore($pos: ResolvedPos): ResolvedPos | null {
	// parent is non-isolating, so we can look across this boundary
	if (!$pos.parent.type.spec.isolating) {
		// search up the tree from the pos's *parent*
		for (let i = $pos.depth - 1; i >= 0; i--) {
			// starting from the inner most node's parent, find out
			// if we're not its first child
			if ($pos.index(i) > 0) {
				return $pos.doc.resolve($pos.before(i + 1));
			}

			if ($pos.node(i).type.spec.isolating) {
				break;
			}
		}
	}

	return null;
}

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
/**
 * @deprecated
 *
 * This method is no longer needed and can be accessed via the
 * `editor-plugin-block-type` command of `setTextLevel`
 */
export function setHeading(level: HeadingLevelsAndNormalText): Command {
	return function (state, dispatch) {
		const { selection, schema, tr } = state;
		const ranges = selection instanceof CellSelection ? selection.ranges : [selection];
		ranges.forEach(({ $from, $to }) => {
			tr.setBlockType($from.pos, $to.pos, schema.nodes.heading, {
				level,
			});
		});

		if (dispatch) {
			dispatch(tr);
		}

		return true;
	};
}

// eslint-disable-next-line @atlaskit/editor/no-re-export
export { insertBlock } from './insert-block';
