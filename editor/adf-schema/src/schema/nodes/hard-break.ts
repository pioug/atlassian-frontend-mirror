import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';
import { hardBreak as hardBreakFactory } from '../../next-schema/generated/nodeTypes';

/**
 * @name hardBreak_node
 */
export interface HardBreakDefinition {
	attrs?: {
		text?: '\n';
	};
	type: 'hardBreak';
}

export const hardBreak: NodeSpec = hardBreakFactory({
	parseDOM: [{ tag: 'br' }],
	toDOM() {
		return ['br'];
	},
});
