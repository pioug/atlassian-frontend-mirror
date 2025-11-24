import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';

import type { BlockMenuPlugin } from '../blockMenuPluginType';
import { getSelectedNode } from '../editor-commands/transform-node-utils/utils';

import { getOutputNodes } from './transform-node-utils/transform';
import type { FormatNodeAnalyticsAttrs } from './transforms/types';

export const transformNode =
	(api?: ExtractInjectionAPI<BlockMenuPlugin>) =>
	(targetType: NodeType, analyticsAttrs?: FormatNodeAnalyticsAttrs): EditorCommand => {
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
