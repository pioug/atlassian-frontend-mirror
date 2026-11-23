import { bind } from 'bind-event-listener';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorState, Selection } from '@atlaskit/editor-prosemirror/state';
import { AllSelection, PluginKey, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

export const inlineNodeInRangeSelectionClassName = 'ak-editor-inline-node-in-range-selection';

/** Inline atom nodes that show a selection treatment instead of the native text highlight. */
export const inlineNodeRangeSelectionNodeTypeNames = [
	'inlineCard',
	'mention',
	'status',
	'date',
	'emoji',
] as const;

const pluginKey = new PluginKey<DecorationSet>('inlineNodeRangeSelectionPlugin');
const activeReadOnlySelectionAttribute = 'data-inline-node-readonly-selection-active';

const isNonEmptyRangeSelection = (selection: Selection) =>
	!selection.empty && (selection instanceof TextSelection || selection instanceof AllSelection);

/**
 * Marks every node of the given inline atom types that sits inside a text or all selection,
 * so it can show a selection treatment instead of the native text highlight on its internals.
 */
const getInlineNodeRangeSelectionDecorations = (
	{ doc, schema, selection }: EditorState,
	nodeTypeNames: readonly string[],
): DecorationSet => {
	if (!isNonEmptyRangeSelection(selection)) {
		return DecorationSet.empty;
	}
	const nodeTypes = new Set(nodeTypeNames.map((name) => schema.nodes[name]).filter(Boolean));
	if (nodeTypes.size === 0) {
		return DecorationSet.empty;
	}

	const decorations: Decoration[] = [];
	doc.nodesBetween(selection.from, selection.to, (node, pos) => {
		if (!nodeTypes.has(node.type)) {
			return true;
		}
		decorations.push(
			Decoration.node(pos, pos + node.nodeSize, { class: inlineNodeInRangeSelectionClassName }),
		);
		return false;
	});

	return DecorationSet.create(doc, decorations);
};

export const createInlineNodeRangeSelectionPlugin = (
	nodeTypeNames: readonly string[] = inlineNodeRangeSelectionNodeTypeNames,
): SafePlugin<DecorationSet> =>
	new SafePlugin<DecorationSet>({
		key: pluginKey,
		state: {
			init: (_config, state) => getInlineNodeRangeSelectionDecorations(state, nodeTypeNames),
			apply: (tr, decorations, _oldState, newState) =>
				tr.docChanged || tr.selectionSet
					? getInlineNodeRangeSelectionDecorations(newState, nodeTypeNames)
					: decorations,
		},
		props: {
			decorations: (state) => pluginKey.getState(state),
		},
		view: (view) => {
			const ownerDocument = view.dom.ownerDocument;
			const updateReadOnlySelection = () => {
				const selection = ownerDocument.getSelection();
				// Read-only editors do not receive ProseMirror's focus class, and can retain
				// their editor selection after the native selection moves elsewhere.
				const isActive =
					!view.editable &&
					view.dom.getAttribute('aria-readonly') === 'true' &&
					selection !== null &&
					!selection.isCollapsed &&
					selection.rangeCount > 0 &&
					selection.getRangeAt(0).intersectsNode(view.dom);

				if (view.dom.hasAttribute(activeReadOnlySelectionAttribute) !== isActive) {
					view.dom.toggleAttribute(activeReadOnlySelectionAttribute, isActive);
				}
			};

			const unbindSelectionChange = bind(ownerDocument, {
				type: 'selectionchange',
				listener: updateReadOnlySelection,
			});
			updateReadOnlySelection();

			return {
				update: updateReadOnlySelection,
				destroy: () => {
					unbindSelectionChange();
					view.dom.removeAttribute(activeReadOnlySelectionAttribute);
				},
			};
		},
	});
