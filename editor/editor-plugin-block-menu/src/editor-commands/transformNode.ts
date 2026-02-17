import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { startMeasure, stopMeasure } from '@atlaskit/editor-common/performance-measures';
import {
	expandSelectionToBlockRange,
	getSourceNodesFromSelectionRange,
} from '@atlaskit/editor-common/selection';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { Mapping, StepMap } from '@atlaskit/editor-prosemirror/transform';
import { CellSelection } from '@atlaskit/editor-tables';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockMenuPlugin } from '../blockMenuPluginType';
import { isNestedNode } from '../ui/utils/isNestedNode';

import { convertNodesToTargetType } from './transform-node-utils/transform';
import type { TransformNodeMetadata } from './transforms/types';
import { isListNode } from './transforms/utils';

export const transformNode: (
	api?: ExtractInjectionAPI<BlockMenuPlugin>,
) => (targetType: NodeType, metadata?: TransformNodeMetadata) => EditorCommand =
	(
		api?: ExtractInjectionAPI<BlockMenuPlugin>,
	): ((targetType: NodeType, metadata?: TransformNodeMetadata) => EditorCommand) =>
	(targetType: NodeType, metadata?: TransformNodeMetadata): EditorCommand =>
	({ tr }) => {
		const preservedSelection = api?.blockControls?.sharedState.currentState()?.preservedSelection;

		if (!preservedSelection) {
			return tr;
		}

		const measureId = `transformNode_${targetType.name}_${Date.now()}`;
		startMeasure(measureId);

		const { nodes } = tr.doc.type.schema;
		const { $from, $to } = expandSelectionToBlockRange(preservedSelection);

		const selectedParent = $from.parent;
		const isParentLayout = selectedParent.type === nodes.layoutColumn;
		const isNested = isNestedNode(preservedSelection, '') && !isParentLayout;
		const isList = isListNode(selectedParent);

		const sourceNodes = getSourceNodesFromSelectionRange(tr, preservedSelection);
		const sourceNodeTypes: Record<string, number> = {};
		sourceNodes.forEach((node) => {
			const typeName = node.type.name;
			sourceNodeTypes[typeName] = (sourceNodeTypes[typeName] || 0) + 1;
		});

		// Check if source node is empty paragraph or heading
		const isEmptyLine =
			sourceNodes.length === 1 &&
			(sourceNodes[0].type === nodes.paragraph || sourceNodes[0].type === nodes.heading) &&
			(sourceNodes[0].content.size === 0 || sourceNodes[0].textContent.trim() === '');

		const resultNodes = convertNodesToTargetType({
			sourceNodes,
			targetNodeType: targetType,
			schema: tr.doc.type.schema,
			isNested,
			targetAttrs: metadata?.targetAttrs,
			parentNode: selectedParent,
		});

		const content = resultNodes.length > 0 ? resultNodes : sourceNodes;
		const sliceStart = isList ? $from.pos - 1 : $from.pos;

		if (
			preservedSelection instanceof NodeSelection &&
			preservedSelection.node.type === nodes.mediaSingle
		) {
			// when node is media single, use tr.replaceWith freeze editor, if modify position, tr.replaceWith creates duplicats
			const deleteFrom = $from.pos;
			const deleteTo = $to.pos;
			tr.delete(deleteFrom, deleteTo);
			// After deletion, recalculate the insertion position to ensure it's valid
			// especially when mediaSingle with caption is at the bottom of the document
			const insertPos = Math.min(deleteFrom, tr.doc.content.size);
			tr.insert(insertPos, content);

			// when we replace and insert content, we need to manually map the preserved selection
			// through the transaction, otherwise it will treat the selection as having been deleted
			// and stop preserving it
			const oldSize = sourceNodes.reduce((sum, node) => sum + node.nodeSize, 0);
			const newSize = content.reduce((sum, node) => sum + node.nodeSize, 0);
			api?.blockControls?.commands.mapPreservedSelection(
				new Mapping([new StepMap([0, oldSize, newSize])]),
			)({ tr });
	} else {
		tr.replaceWith(sliceStart, $to.pos, content);
	}

	// [FEATURE FLAG: platform_editor_table_transform_selection_fix]
	// Fixes table cell selection not being preserved after transform to expand/layout.
	// When a table with CellSelection is transformed, we need to re-select the wrapper node.
	// To clean up: remove the if-else block and keep only the flag-on behavior.
	if (preservedSelection instanceof CellSelection && fg('platform_editor_table_transform_selection_fix')) {
		const insertedNode = tr.doc.nodeAt($from.pos);
		const isSelectable = insertedNode && NodeSelection.isSelectable(insertedNode);

			if (isSelectable) {
				const nodeSelection = NodeSelection.create(tr.doc, $from.pos);
				tr.setSelection(nodeSelection);

				// Update preserved selection to match the new NodeSelection
				// This prevents appendTransaction from restoring the old table selection positions
				api?.blockControls?.commands.startPreservingSelection()({ tr });
			}
		}

		stopMeasure(measureId, (duration, startTime) => {
			api?.analytics?.actions?.attachAnalyticsEvent({
				action: ACTION.TRANSFORMED,
				actionSubject: ACTION_SUBJECT.ELEMENT,
				attributes: {
					duration,
					isEmptyLine,
					isNested,
					sourceNodesCount: sourceNodes.length,
					sourceNodesCountByType: sourceNodeTypes,
					sourceNodeType: sourceNodes.length === 1 ? sourceNodes[0].type.name : 'multiple',
					startTime,
					targetNodeType: targetType.name,
					outputNodesCount: content.length,
					inputMethod: INPUT_METHOD.BLOCK_MENU,
				},
				eventType: EVENT_TYPE.TRACK,
			})(tr);
		});

		return tr;
	};
