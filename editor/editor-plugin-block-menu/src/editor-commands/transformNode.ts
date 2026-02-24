import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { expandedState } from '@atlaskit/editor-common/expand';
import { logException } from '@atlaskit/editor-common/monitoring';
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

		try {
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

			// [FEATURE FLAG: platform_editor_block_menu_expand_localid_fix]
			// Pre-populates the expandedState WeakMap so ExpandNodeView initializes newly created
			// expand/nestedExpand nodes as expanded rather than collapsed. Works in conjunction with
			// the localId pre-assignment in the transform steps — without a pre-assigned localId the
			// localId plugin's appendTransaction replaces the node object (via setNodeAttribute),
			// invalidating this WeakMap entry. The else branch preserves the previous behaviour.
			// To clean up: remove the if-else block and keep only the flag-on body.
			if (fg('platform_editor_block_menu_expand_localid_fix')) {
				const { expand, nestedExpand } = nodes;
				content.forEach((node) => {
					if (node.type === expand || node.type === nestedExpand) {
						expandedState.set(node, true);
					}
				});
			}

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

			if (preservedSelection instanceof CellSelection) {
				const insertedNode = tr.doc.nodeAt($from.pos);
				const isSelectable = insertedNode && NodeSelection.isSelectable(insertedNode);

				if (isSelectable) {
					const nodeSelection = NodeSelection.create(tr.doc, $from.pos);
					tr.setSelection(nodeSelection);

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
		} catch (error) {
			stopMeasure(measureId);

			logException(error as Error, { location: 'editor-plugin-block-menu' });

			api?.analytics?.actions?.attachAnalyticsEvent({
				action: ACTION.ERRORED,
				actionSubject: ACTION_SUBJECT.ELEMENT,
				actionSubjectId: ACTION_SUBJECT_ID.TRANSFORM,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: {
					docSize: tr.doc.nodeSize,
					error: (error as Error).message,
					errorStack: (error as Error).stack,
					from: sourceNodes.length === 1 ? sourceNodes[0].type.name : 'multiple',
					inputMethod: INPUT_METHOD.BLOCK_MENU,
					selection: preservedSelection.toJSON(),
					to: targetType.name,
				},
			})(tr);
		}

		return tr;
	};
