import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Fragment, type NodeType } from '@atlaskit/editor-prosemirror/model';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

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

			const { from, to, $from } = preservedSelection;

			const selectedParent = $from.parent;

			let fragment = Fragment.empty;

			const isList = isListNode(selectedParent);

			const slice = tr.doc.slice(isList ? from - 1 : from, isList ? to + 1 : to);

			slice.content.forEach((node) => {
				const outputNode = getOutputNodes({
					sourceNode: node,
					targetNodeType: targetType,
					schema: tr.doc.type.schema,
				});

				if (outputNode) {
					fragment = fragment.append(Fragment.fromArray(outputNode));
				}
			});

			tr.replaceWith(
				isList ? preservedSelection.from - 1 : preservedSelection.from,
				preservedSelection.to,
				fragment,
			);

			return tr;
		};
	};
