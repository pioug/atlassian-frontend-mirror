import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Fragment, type Node as PMNode, type Schema } from '@atlaskit/editor-prosemirror/model';

import { MAX_LAYOUT_COLUMN_SUPPORTED } from '../consts';
import type { BlockControlsPlugin } from '../types';
import { DEFAULT_COLUMN_DISTRIBUTIONS } from '../ui/consts';

type LayoutContent = Fragment | PMNode;

const createNewLayout = (schema: Schema, layoutContents: LayoutContent[]) => {
	if (layoutContents.length === 0 || layoutContents.length > MAX_LAYOUT_COLUMN_SUPPORTED) {
		return null;
	}

	const width = DEFAULT_COLUMN_DISTRIBUTIONS[layoutContents.length];

	if (!width) {
		return null;
	}

	const { layoutSection, layoutColumn } = schema.nodes || {};

	try {
		const layoutContent = Fragment.fromArray(
			layoutContents.map((layoutContent) => {
				return layoutColumn.createChecked(
					{
						width,
					},
					layoutContent,
				);
			}),
		);

		const layoutSectionNode = layoutSection.createChecked(undefined, layoutContent);

		return layoutSectionNode;
	} catch (error) {
		// TODO analytics
	}

	return null;
};

export const moveToLayout =
	(api?: ExtractInjectionAPI<BlockControlsPlugin>) =>
	(from: number, to: number, position: 'left' | 'right'): EditorCommand =>
	({ tr }) => {
		// unable to drag a node to itself.
		if (from === to) {
			return tr;
		}

		const { layoutSection, layoutColumn, doc } = tr.doc.type.schema.nodes || {};
		const { breakout } = tr.doc.type.schema.marks || {};

		// layout plugin does not exist
		if (!layoutSection || !layoutColumn) {
			return tr;
		}

		const $to = tr.doc.resolve(to);

		// invalid to position or not top level.
		if (!$to.nodeAfter || $to.parent.type !== doc) {
			return tr;
		}

		const $from = tr.doc.resolve(from);

		// invalid from position or dragging a layout
		if (!$from.nodeAfter || $from.nodeAfter.type === layoutSection) {
			return tr;
		}

		const toNode = $to.nodeAfter;
		const fromNode = $from.nodeAfter;

		// remove breakout from node;
		if (breakout && $from.nodeAfter && $from.nodeAfter.marks.some((m) => m.type === breakout)) {
			tr = tr.removeNodeMark(from, breakout);
		}

		if ($to.nodeAfter.type === layoutSection) {
			const existingLayoutNode = $to.nodeAfter;

			if (existingLayoutNode.childCount < MAX_LAYOUT_COLUMN_SUPPORTED) {
				const toPos = position === 'left' ? to + 1 : to + existingLayoutNode.nodeSize - 1;

				tr = tr.insert(
					toPos,
					// resolve again the source node after node updated (remove breakout marks)
					layoutColumn.create(null, tr.doc.resolve(from).nodeAfter),
				);
				const mappedFrom = tr.mapping.map(from);
				const mappedFromEnd = mappedFrom + fromNode.nodeSize;
				tr = tr.delete(mappedFrom, mappedFromEnd);
				return tr;
			}
			return tr;
		} else {
			// resolve again the source node after node updated (remove breakout marks)
			const newFromNode = tr.doc.resolve(from).nodeAfter;

			if (!newFromNode) {
				return tr;
			}
			const layoutContents = position === 'left' ? [newFromNode, toNode] : [toNode, newFromNode];

			const newLayout = createNewLayout(tr.doc.type.schema, layoutContents);

			if (newLayout) {
				tr = tr.delete(from, from + fromNode.nodeSize);
				const mappedTo = tr.mapping.map(to);
				tr = tr.delete(mappedTo, mappedTo + toNode.nodeSize);
				tr = tr.insert(mappedTo, newLayout); // insert the content at the new position
			}

			return tr;
		}
	};
