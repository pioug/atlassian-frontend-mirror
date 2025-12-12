import { hardBreak as hardBreakFactory } from '../../next-schema/generated/nodeTypes';

/**
 * @name hardBreak_node
 */
export interface HardBreakDefinition {
	type: 'hardBreak';
	attrs?: {
		text?: '\n';
	};
}

export const hardBreak = hardBreakFactory({
	parseDOM: [{ tag: 'br' }],
	toDOM() {
		return ['br'];
	},
});
