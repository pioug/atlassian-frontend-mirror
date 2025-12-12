import type { MarkSpec } from '@atlaskit/editor-prosemirror/model';
import { underline as underlineFactory } from '../../next-schema/generated/markTypes';

/**
 * @name underline_mark
 */
export interface UnderlineDefinition {
	type: 'underline';
}

export const underline: MarkSpec = underlineFactory({
	parseDOM: [
		{ tag: 'u' },
		{
			style: 'text-decoration',
			getAttrs: (value) => value === 'underline' && null,
		},
	],
	toDOM(): [string] {
		return ['u'];
	},
});
