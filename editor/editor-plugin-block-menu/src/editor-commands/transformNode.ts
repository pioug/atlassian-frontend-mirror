import { expandToBlockRange } from '@atlaskit/editor-common/selection';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Fragment, type NodeType } from '@atlaskit/editor-prosemirror/model';

import type { BlockMenuPlugin } from '../blockMenuPluginType';
import { isNestedNode } from '../ui/utils/isNestedNode';

import { getOutputNodes } from './transform-node-utils/transform';
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

			const { $from, $to } = expandToBlockRange(preservedSelection.$from, preservedSelection.$to);
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

			// TODO: ED-12345 - selection is broken post transaction, to fix.
			tr.replaceWith(isList ? $from.pos - 1 : $from.pos, $to.pos, fragment);

			return tr;
		};
	};
