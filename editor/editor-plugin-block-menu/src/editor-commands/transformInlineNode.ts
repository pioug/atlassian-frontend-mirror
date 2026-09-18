import { startMeasure, stopMeasure } from '@atlaskit/editor-common/performance-measures';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';

import type { BlockMenuPlugin } from '../blockMenuPluginType';
import { isNestedNode } from '../ui/utils/isNestedNode';
import { isEmptyLine } from './is-empty-line';
import { createTransformAnalytics } from './transform-analytics';
import type { TransformInlineNodeMetadata } from './types';

export const transformInlineNode: (
	api?: ExtractInjectionAPI<BlockMenuPlugin>,
) => (metadata: TransformInlineNodeMetadata) => EditorCommand =
	(api?: ExtractInjectionAPI<BlockMenuPlugin>) =>
	(metadata: TransformInlineNodeMetadata): EditorCommand =>
	({ tr }) => {
		const preservedSelection = api?.blockControls?.sharedState.currentState()?.preservedSelection;

		if (!preservedSelection || !(preservedSelection instanceof NodeSelection)) {
			return tr;
		}

		const source = { node: preservedSelection.node, pos: preservedSelection.from };

		const analytics = createTransformAnalytics(api, tr, preservedSelection);
		const measureId = `transformInlineNode_${metadata.targetTypeName}_${Date.now()}`;
		startMeasure(measureId);

		const isParentLayout =
			tr.doc.resolve(source.pos).parent.type === tr.doc.type.schema.nodes.layoutColumn;
		const isNested = isNestedNode(preservedSelection, '') && !isParentLayout;

		try {
			const inlineNode = metadata.buildInlineNode(source.node);
			const paragraphNode = tr.doc.type.schema.nodes.paragraph.createChecked({}, [inlineNode]);

			tr.replaceWith(source.pos, source.pos + source.node.nodeSize, paragraphNode);

			if (NodeSelection.isSelectable(inlineNode)) {
				tr.setSelection(NodeSelection.create(tr.doc, source.pos + 1));
			}

			api?.blockControls?.commands.stopPreservingSelection()({ tr });
			api?.blockControls?.commands.toggleBlockMenu({ closeMenu: true })({ tr });

			stopMeasure(measureId, (duration, startTime) => {
				analytics.transformed(duration, startTime, {
					isEmptyLine: isEmptyLine([source.node]),
					isNested,
					isSuggested: Boolean(metadata.isSuggested),
					outputNodesCount: 1,
					sourceNodes: [source.node],
					targetNodeType: metadata.targetTypeName,
				});
			});
		} catch (error) {
			stopMeasure(measureId);
			analytics.errored(error, [source.node], metadata.targetTypeName);
		}

		return tr;
	};
