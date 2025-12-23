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

			const schema = tr.doc.type.schema;
			const { nodes } = schema;
			const { $from, $to } = expandSelectionToBlockRange(preservedSelection);

			const selectedParent = $from.parent;
			const isParentLayout = selectedParent.type === nodes.layoutColumn;
			const isNestedExceptLayout = isNestedNode(preservedSelection, '') && !isParentLayout;

			const isList = isListNode(selectedParent);

			const slice = tr.doc.slice(
				isList ? $from.pos - 1 : $from.pos,
				isList ? $to.pos + 1 : $to.pos,
			);

			const transformedNodes = tranformContent(
				slice.content,
				targetType,
				schema,
				isNestedExceptLayout,
				metadata?.targetAttrs,
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

			return tr;
		};
	};
