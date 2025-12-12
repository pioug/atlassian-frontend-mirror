import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Fragment, type NodeType } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';

import type { BlockMenuPlugin } from '../blockMenuPluginType';
import { isNestedNode } from '../ui/utils/isNestedNode';

import { getOutputNodes } from './transform-node-utils/transform';
import { expandSelectionToBlockRange } from './transform-node-utils/utils';
import type { TransformNodeAnalyticsAttrs } from './transforms/types';
import { isListNode } from './transforms/utils';

export const transformNode =
	(api?: ExtractInjectionAPI<BlockMenuPlugin>) =>
	// eslint-disable-next-line no-unused-vars
	(targetType: NodeType, analyticsAttrs?: TransformNodeAnalyticsAttrs): EditorCommand => {
		return ({ tr }) => {
			const preservedSelection = api?.blockControls?.sharedState.currentState()?.preservedSelection;

			if (!preservedSelection) {
				return tr;
			}

			const schema = tr.doc.type.schema;
			const { nodes } = schema;
			const { $from, $to } = expandSelectionToBlockRange(preservedSelection, schema);
			const isNested = isNestedNode(preservedSelection, '');

			const selectedParent = $from.parent;

			let fragment = Fragment.empty;

			const isList = isListNode(selectedParent);

			const slice = tr.doc.slice(
				isList ? $from.pos - 1 : $from.pos,
				isList ? $to.pos + 1 : $to.pos,
			);

			slice.content.forEach((node) => {
				const outputNode = getOutputNodes({
					sourceNode: node,
					targetNodeType: targetType,
					schema: tr.doc.type.schema,
					isNested,
				});

				if (outputNode) {
					fragment = fragment.append(Fragment.fromArray(outputNode));
				}
			});

			const nodesToDeleteAndInsert = [nodes.mediaSingle];
			if (
				preservedSelection instanceof NodeSelection &&
				nodesToDeleteAndInsert.includes(preservedSelection.node.type)
			) {
				// when node is media single, use tr.replaceWith freeze editor, if modify position, tr.replaceWith creates duplicats
				tr.deleteRange($from.pos, $to.pos);
				tr.insert($from.pos, fragment);
			} else {
				// TODO: ED-12345 - selection is broken post transaction, to fix.
				tr.replaceWith(isList ? $from.pos - 1 : $from.pos, $to.pos, fragment);
			}

			return tr;
		};
	};
