import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { startMeasure, stopMeasure } from '@atlaskit/editor-common/performance-measures';
import { expandSelectionToBlockRange } from '@atlaskit/editor-common/selection';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type NodeType } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';

import type { BlockMenuPlugin } from '../blockMenuPluginType';
import { isNestedNode } from '../ui/utils/isNestedNode';

import { tranformContent } from './transform-node-utils/tranformContent';
import type { TransformNodeMetadata } from './transforms/types';
import { isListNode } from './transforms/utils';

export const transformNode =
	(api?: ExtractInjectionAPI<BlockMenuPlugin>) =>
	// eslint-disable-next-line no-unused-vars
	(targetType: NodeType, metadata?: TransformNodeMetadata): EditorCommand => {
		return ({ tr }) => {
			const preservedSelection = api?.blockControls?.sharedState.currentState()?.preservedSelection;

			if (!preservedSelection) {
				return tr;
			}

			// Start performance measurement
			const measureId = `transformNode_${targetType.name}_${Date.now()}`;
			startMeasure(measureId);

			const schema = tr.doc.type.schema;
			const { nodes } = schema;
			const { $from, $to } = expandSelectionToBlockRange(preservedSelection);

			const selectedParent = $from.parent;
			const isNested = isNestedNode(preservedSelection, '');

			const isList = isListNode(selectedParent);

			const slice = tr.doc.slice(
				isList ? $from.pos - 1 : $from.pos,
				isList ? $to.pos + 1 : $to.pos,
			);

			// Collect source node information for analytics before transformation
			let nodeCount = 0;
			const sourceNodeTypes: Record<string, number> = {};
			slice.content.forEach((node) => {
				nodeCount++;
				const nodeTypeName = node.type.name;
				sourceNodeTypes[nodeTypeName] = (sourceNodeTypes[nodeTypeName] || 0) + 1;
			});

			const transformedNodes = tranformContent(
				slice.content,
				targetType,
				schema,
				isNested,
				metadata?.targetAttrs,
				selectedParent,
			);

			const nodesToDeleteAndInsert = [nodes.mediaSingle];
			if (
				preservedSelection instanceof NodeSelection &&
				nodesToDeleteAndInsert.includes(preservedSelection.node.type)
			) {
				// when node is media single, use tr.replaceWith freeze editor, if modify position, tr.replaceWith creates duplicats
				tr.deleteRange($from.pos, $to.pos);
				tr.insert($from.pos, transformedNodes);
			} else {
				tr.replaceWith(isList ? $from.pos - 1 : $from.pos, $to.pos, transformedNodes);
			}

			// Stop performance measurement and fire analytics
			stopMeasure(measureId, (duration, startTime) => {
				api?.analytics?.actions?.fireAnalyticsEvent({
					action: ACTION.TRANSFORMED,
					actionSubject: ACTION_SUBJECT.ELEMENT,
					actionSubjectId: ACTION_SUBJECT_ID.TRANSFORM,
					attributes: {
						duration,
						isList,
						isNested,
						nodeCount,
						sourceNodeTypes,
						startTime,
						targetNodeType: targetType.name,
					},
					eventType: EVENT_TYPE.OPERATIONAL,
				});
			});

			return tr;
		};
	};
