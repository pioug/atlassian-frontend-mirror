import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { startMeasure, stopMeasure } from '@atlaskit/editor-common/performance-measures';
import { expandSelectionToBlockRange } from '@atlaskit/editor-common/selection';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { Mapping, StepMap } from '@atlaskit/editor-prosemirror/transform';

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

		const sliceStart = isList ? $from.pos - 1 : $from.pos;
		const sliceEnd = isList ? $to.pos + 1 : $to.pos;
		const slice = tr.doc.slice(sliceStart, sliceEnd);

		const sourceNodes = [...slice.content.content];
		const sourceNodeTypes: Record<string, number> = {};
		sourceNodes.forEach((node) => {
			const typeName = node.type.name;
			sourceNodeTypes[typeName] = (sourceNodeTypes[typeName] || 0) + 1;
		});

		const resultNodes = convertNodesToTargetType({
			sourceNodes,
			targetNodeType: targetType,
			schema: tr.doc.type.schema,
			isNested,
			targetAttrs: metadata?.targetAttrs,
			parentNode: selectedParent,
		});

		const content = resultNodes.length > 0 ? resultNodes : slice.content;

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
			const oldSize = slice.size;
			const newSize = Array.isArray(content)
				? content.reduce((sum, node) => sum + node.nodeSize, 0)
				: content.size;
			api?.blockControls?.commands.mapPreservedSelection(
				new Mapping([new StepMap([0, oldSize, newSize])]),
			)({ tr });
		} else {
			tr.replaceWith(sliceStart, $to.pos, content);
		}

		stopMeasure(measureId, (duration, startTime) => {
			api?.analytics?.actions?.fireAnalyticsEvent({
				action: ACTION.TRANSFORMED,
				actionSubject: ACTION_SUBJECT.ELEMENT,
				actionSubjectId: ACTION_SUBJECT_ID.TRANSFORM,
				attributes: {
					duration,
					isList,
					isNested,
					nodeCount: sourceNodes.length,
					sourceNodeTypes,
					startTime,
					targetNodeType: targetType.name,
				},
				eventType: EVENT_TYPE.OPERATIONAL,
			});
		});

		return tr;
	};
