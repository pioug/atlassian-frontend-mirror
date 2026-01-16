import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { nodeToJSON, type JSONNode } from '@atlaskit/editor-json-transformer';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, type Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';

import type { SelectionPlugin } from '../selectionPluginType';

const listDepth = 3;

const selectionCoversAllListItems = ($from: ResolvedPos, $to: ResolvedPos) => {
	// Block level lists
	const listParents = ['bulletList', 'orderedList'];
	if ($from.depth >= listDepth && $to.depth >= listDepth && $from.depth === $to.depth) {
		// Get grandparents (from)
		const grandparentFrom = $from.node($from.depth - 1);
		const greatGrandparentFrom = $from.node($from.depth - 2);
		// Get grandparents (to)
		const grandparentTo = $to.node($from.depth - 1);
		const greatGrandparentTo = $to.node($from.depth - 2);
		if (
			greatGrandparentTo.eq(greatGrandparentFrom) &&
			listParents.includes(greatGrandparentFrom.type.name) &&
			// Selection covers entire list
			greatGrandparentFrom.firstChild?.eq(grandparentFrom) &&
			greatGrandparentFrom.lastChild?.eq(grandparentTo)
		) {
			return true;
		}
	}
	return false;
};

/**
 * Get the slice of the document corresponding to the selection.
 * This is similar to the prosemirror `selection.content()` - but
 * does not include the parents (unless the result is inline)
 *
 * @param selection The selection to get the slice for.
 * @returns The slice of the document corresponding to the selection.
 */
export const getSliceFromSelection = (selection: Selection): Fragment => {
	const { from, to } = selection;
	if (from === to) {
		return Fragment.empty;
	}

	let frag = Fragment.empty;
	const sortedRanges = [...selection.ranges.slice()].sort((a, b) => a.$from.pos - b.$from.pos);
	for (const range of sortedRanges) {
		const { $from, $to } = range;
		const to = $to.pos;
		const depth =
			// If we're in a text selection, and share the parent node across the anchor->head
			// make the depth the parent node
			selection instanceof TextSelection && $from.parent.eq($to.parent)
				? Math.max(0, $from.sharedDepth(to) - 1)
				: $from.sharedDepth(to);
		let finalDepth = depth;
		// For block-level lists (non-nested) specifically use the selection
		if (selectionCoversAllListItems($from, $to)) {
			finalDepth = $from.depth - listDepth;
		}
		const start = $from.start(finalDepth);
		const node = $from.node(finalDepth);
		const content = node.content.cut($from.pos - start, $to.pos - start);
		frag = frag.append(content);
	}
	return frag;
};

export const getSelectionFragment =
	(api: ExtractInjectionAPI<SelectionPlugin> | undefined) => () => {
		const selection = api?.selection.sharedState?.currentState()?.selection;
		const schema = api?.core.sharedState.currentState()?.schema;
		if (!selection || !schema || selection.empty) {
			return null;
		}

		const slice = getSliceFromSelection(selection);
		const content = slice.content;

		const fragment: JSONNode[] = [];
		content.forEach((node) => {
			fragment.push(nodeToJSON(node));
		});
		return fragment;
	};

export const getSelectionLocalIds =
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(api: ExtractInjectionAPI<SelectionPlugin> | undefined) => (): any[] | null => {
		let selection = api?.selection.sharedState?.currentState()?.selection;
		if (selection?.empty) {
			// If we have an empty selection the current state might not be correct
			// We have a hack here to retrieve the current selection - but not dispatch a transaction
			api?.core.actions.execute(({ tr }) => {
				selection = tr.selection;
				return null;
			});
		}

		if (!selection) {
			return null;
		}

		if (selection instanceof NodeSelection) {
			return [selection.node.attrs.localId];
		} else if (selection.empty) {
			return [selection.$from.parent.attrs.localId];
		}
		const content = getSliceFromSelection(selection).content;

		const ids: string[] = [];
		content.forEach((node) => {
			const localId = node.attrs?.localId;
			if (localId) {
				ids.push(localId);
			}
		});
		return ids;
	};
