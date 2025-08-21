import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { nodeToJSON, type JSONNode } from '@atlaskit/editor-json-transformer';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, type Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';

import type { SelectionPlugin } from '../selectionPluginType';

/**
 * Get the slice of the document corresponding to the selection.
 * This is similar to the prosemirror `selection.content()` - but
 * does not include the parents (unless the result is inline)
 *
 * @param selection The selection to get the slice for.
 * @returns The slice of the document corresponding to the selection.
 */
const getSlice = (selection: Selection): Fragment => {
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
		const start = $from.start(depth);
		const node = $from.node(depth);
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

		const slice = getSlice(selection);
		const content = slice.content;

		const fragment: JSONNode[] = [];
		content.forEach((node) => {
			fragment.push(nodeToJSON(node));
		});
		return fragment;
	};

export const getSelectionLocalIds =
	(api: ExtractInjectionAPI<SelectionPlugin> | undefined) => () => {
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
		const content = getSlice(selection).content;

		const ids: string[] = [];
		content.forEach((node) => {
			const localId = node.attrs?.localId;
			if (localId) {
				ids.push(localId);
			}
		});
		return ids;
	};
