import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Fragment, type Node as PMNode, type Schema } from '@atlaskit/editor-prosemirror/model';

import type { BlockControlsPlugin } from '../types';
import { DEFAULT_COLUMN_DISTRIBUTIONS } from '../ui/consts';

type LayoutContent = Fragment | PMNode;

const createNewLayout = (schema: Schema, layoutContents: LayoutContent[]) => {
	// TODO update with constant
	if (layoutContents.length === 0 || layoutContents.length > 5) {
		return null;
	}

	const width = DEFAULT_COLUMN_DISTRIBUTIONS[layoutContents.length];

	if (!width) {
		return null;
	}

	const { layoutSection, layoutColumn } = schema.nodes || {};

	try {
		const layoutSectionNode = layoutSection.createChecked(
			undefined,
			Fragment.fromArray(
				layoutContents.map((layoutContent) => {
					return layoutColumn.createChecked(
						{
							width,
						},
						layoutContent,
					);
				}),
			),
		);

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
		const { layoutSection, layoutColumn, doc } = tr.doc.type.schema.nodes || {};

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

		// invalid from position
		if (!$from.nodeAfter) {
			return tr;
		}

		const toNode = $to.nodeAfter;
		const fromNode = $from.nodeAfter;

		const fromNodeEndPos = from + fromNode.nodeSize;
		const toNodeEndPos = to + toNode.nodeSize;

		if ($to.nodeAfter.type !== layoutSection) {
			const layoutContents = position === 'left' ? [fromNode, toNode] : [toNode, fromNode];

			const newLayout = createNewLayout(tr.doc.type.schema, layoutContents);

			if (newLayout) {
				tr.delete(from, fromNodeEndPos);
				const mappedTo = tr.mapping.map(to);
				tr.delete(mappedTo, toNodeEndPos);
				tr.insert(mappedTo, newLayout); // insert the content at the new position
			}

			return tr;
		}

		return tr;
	};
