import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Selection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType, findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { getDefaultSyncBlockSchema } from '@atlaskit/editor-synced-block-provider';
import { CellSelection, findTable } from '@atlaskit/editor-tables';

export const findSyncBlock = (
	state: EditorState,
	selection?: Selection | null,
):
	| ReturnType<ReturnType<typeof findSelectedNodeOfType>>
	| ReturnType<ReturnType<typeof findParentNodeOfType>> => {
	const { syncBlock } = state.schema.nodes;
	return (
		findSelectedNodeOfType(syncBlock)(selection || state.selection) ||
		findParentNodeOfType(syncBlock)(selection || state.selection)
	);
};

export interface SyncBlockConversionInfo {
	contentToInclude: Fragment;
	from: number;
	to: number;
}

export const canBeConvertedToSyncBlock = (
	selection: Selection,
): SyncBlockConversionInfo | false => {
	let from = selection.from;
	let to = selection.to;
	let depth = selection.$from.depth;
	let contentToInclude: Fragment;

	if (selection instanceof CellSelection) {
		const table = findTable(selection);
		if (!table) {
			return false;
		}

		contentToInclude = Fragment.from([table.node]);
		from = table.pos;
		to = table.pos + table.node.nodeSize;
		depth = selection.$from.doc.resolve(table.pos).depth;
	} else {
		contentToInclude = Fragment.from(selection.content().content);
	}

	// sync blocks can't be nested
	if (depth > 1) {
		return false;
	}

	const syncBlockSchema = getDefaultSyncBlockSchema();

	let canBeConverted = true;
	selection.$from.doc.nodesBetween(from, to, (node) => {
		if (!(node.type.name in syncBlockSchema.nodes)) {
			canBeConverted = false;
			return false;
		}
		node.marks.forEach((mark) => {
			if (!(mark.type.name in syncBlockSchema.marks)) {
				canBeConverted = false;
				return false;
			}
		});
	});

	if (!canBeConverted) {
		return false;
	}

	return {
		contentToInclude,
		from,
		to,
	};
};
