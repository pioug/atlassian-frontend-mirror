import { expandedState } from '@atlaskit/editor-common/expand';
import { startMeasure, stopMeasure } from '@atlaskit/editor-common/performance-measures';
import {
	expandSelectionToBlockRange,
	getSourceNodesFromSelectionRange,
} from '@atlaskit/editor-common/selection';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Node } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, Selection } from '@atlaskit/editor-prosemirror/state';
import { Mapping, StepMap } from '@atlaskit/editor-prosemirror/transform';
import { CellSelection } from '@atlaskit/editor-tables';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { BlockMenuPlugin } from '../blockMenuPluginType';
import {
	getSingleTransformSourceNode,
	isExtensionTransformSource,
} from '../editor-actions/transformSource';
import type { BlockMenuTransformSourceRegistry } from '../editor-actions/transformSourceRegistry';
import { isNestedNode } from '../ui/utils/isNestedNode';
import { isEmptyLine } from './is-empty-line';
import { createTransformAnalytics } from './transform-analytics';
import { convertNodesToTargetType } from './transform-node-utils/transform';
import { isListNode } from './transform-node-utils/utils';
import type { TransformNodeMetadata } from './types';

export const transformNode: (
	api?: ExtractInjectionAPI<BlockMenuPlugin>,
	transformRegistry?: Pick<BlockMenuTransformSourceRegistry, 'resolve'>,
) => (targetType: NodeType, metadata?: TransformNodeMetadata) => EditorCommand =
	(
		api?: ExtractInjectionAPI<BlockMenuPlugin>,
		transformRegistry?: Pick<BlockMenuTransformSourceRegistry, 'resolve'>,
	): ((targetType: NodeType, metadata?: TransformNodeMetadata) => EditorCommand) =>
	(targetType: NodeType, metadata?: TransformNodeMetadata): EditorCommand =>
	({ tr }) => {
		const preservedSelection = api?.blockControls?.sharedState.currentState()?.preservedSelection;

		if (!preservedSelection) {
			return tr;
		}
		const isSmallTextTransform = metadata?.targetTypeName === 'smallText';
		const isTextFormattingTransform =
			(metadata?.marksToAdd !== undefined || metadata?.marksToRemove !== undefined) &&
			isExperimentEnabled('platform_editor_block_menu_small_text');
		if (isSmallTextTransform && !isTextFormattingTransform) {
			return null;
		}

		const analytics = createTransformAnalytics(api, tr, preservedSelection);

		const { $from, $to, range } = expandSelectionToBlockRange(preservedSelection);
		const sourceNode = getSingleTransformSourceNode(preservedSelection, range);

		if (isExtensionTransformSource(sourceNode)) {
			const context = {
				source: sourceNode.toJSON(),
				targetTypeName: metadata?.targetTypeName ?? targetType.name,
			};
			const resolution = transformRegistry?.resolve(context);
			if (!resolution || resolution.status === 'unsupported') {
				return tr;
			}

			const measureId = `transformNode_${targetType.name}_${Date.now()}`;
			startMeasure(measureId);

			try {
				const transformResult = resolution.transform.transform(context);
				if (!transformResult) {
					stopMeasure(measureId);
					return tr;
				}
				if (!Array.isArray(transformResult.output) || transformResult.output.length === 0) {
					throw new Error('Block menu transform returned no output');
				}

				const resultNodes = transformResult.output.map((nodeAdf) => {
					const node = Node.fromJSON(tr.doc.type.schema, nodeAdf);
					node.check();
					return node;
				});

				if (
					!range ||
					!range.parent.canReplace(range.startIndex, range.endIndex, Fragment.from(resultNodes))
				) {
					throw new Error('Block menu transform output is invalid at the selected position');
				}

				const sliceStart = $from.pos;
				tr.replaceWith(sliceStart, $to.pos, resultNodes);

				const insertedNode = tr.doc.nodeAt(sliceStart);
				const nextSelection =
					insertedNode && NodeSelection.isSelectable(insertedNode)
						? NodeSelection.create(tr.doc, sliceStart)
						: Selection.near(tr.doc.resolve(sliceStart));
				tr.setSelection(nextSelection);
				api?.blockControls?.commands.stopPreservingSelection()({ tr });
				api?.blockControls?.commands.toggleBlockMenu({ closeMenu: true })({ tr });

				const { expand, nestedExpand } = tr.doc.type.schema.nodes;
				resultNodes.forEach((node) => {
					if (node.type === expand || node.type === nestedExpand) {
						expandedState.set(node, true);
					}
				});

				stopMeasure(measureId, (duration, startTime) => {
					analytics.transformed(duration, startTime, {
						isNested: isNestedNode(preservedSelection, ''),
						isSuggested: Boolean(metadata?.isSuggested),
						outputNodesCount: resultNodes.length,
						sourceNodes: [sourceNode],
						targetNodeType: targetType.name,
					});
				});
			} catch (error) {
				stopMeasure(measureId);
				analytics.errored(error, [sourceNode], targetType.name);
			}

			return tr;
		}

		const measureId = `transformNode_${targetType.name}_${Date.now()}`;
		startMeasure(measureId);
		const docBeforeTransform = tr.doc;

		const { nodes } = tr.doc.type.schema;

		const selectedParent = $from.parent;
		const isParentLayout = selectedParent.type === nodes.layoutColumn;
		const isNested = isNestedNode(preservedSelection, '') && !isParentLayout;
		const isList = isListNode(selectedParent);

		const sourceNodes = getSourceNodesFromSelectionRange(tr, preservedSelection);
		const isSuggested = Boolean(metadata?.isSuggested);

		try {
			const resultNodes = convertNodesToTargetType({
				sourceNodes,
				targetNodeType: targetType,
				schema: tr.doc.type.schema,
				isNested,
				targetAttrs: metadata?.targetAttrs,
				marksToAdd: isTextFormattingTransform ? metadata?.marksToAdd : undefined,
				marksToRemove: isTextFormattingTransform ? metadata?.marksToRemove : undefined,
				parentNode: selectedParent,
			});

			const content = resultNodes.length > 0 ? resultNodes : sourceNodes;
			const sliceStart = isList ? $from.pos - 1 : $from.pos;

			const { expand, nestedExpand } = nodes;
			content.forEach((node) => {
				if (node.type === expand || node.type === nestedExpand) {
					expandedState.set(node, true);
				}
			});

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

			if (isTextFormattingTransform && tr.doc.eq(docBeforeTransform)) {
				stopMeasure(measureId);
				return null;
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

			api?.blockControls?.commands.toggleBlockMenu({ closeMenu: true })({ tr });

			stopMeasure(measureId, (duration, startTime) => {
				analytics.transformed(duration, startTime, {
					isEmptyLine: isEmptyLine(sourceNodes),
					isNested,
					isSuggested,
					outputNodesCount: content.length,
					sourceNodes,
					targetNodeType: isSmallTextTransform ? 'smallText' : targetType.name,
				});
			});
		} catch (error) {
			stopMeasure(measureId);
			analytics.errored(error, sourceNodes, targetType.name);
		}

		return tr;
	};
