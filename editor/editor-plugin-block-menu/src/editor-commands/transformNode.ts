import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';

import type { BlockMenuPlugin } from '../blockMenuPluginType';
import { getSelectedNode } from '../editor-commands/transform-node-utils/utils';

import { getOutputNodes } from './transform-node-utils/transform';
import type { TransformNodeAnalyticsAttrs } from './transforms/types';

export const transformNode =
	// eslint-disable-next-line no-unused-vars
	(api?: ExtractInjectionAPI<BlockMenuPlugin>) =>
		// eslint-disable-next-line no-unused-vars
		(targetType: NodeType, analyticsAttrs?: TransformNodeAnalyticsAttrs): EditorCommand => {
			return ({ tr }) => {
				const { selection } = tr;
				const source = getSelectedNode(selection);
				if (!source) {
					return tr;
				}

				const outputNodes = getOutputNodes({
					sourceNode: source.node,
					targetNodeType: targetType,
					schema: selection.$from.doc.type.schema,
				});
				if (!outputNodes) {
					return tr;
				}

				tr.replaceWith(source.pos, source.pos + source.node.nodeSize, outputNodes);

				return tr;
			};
		};
