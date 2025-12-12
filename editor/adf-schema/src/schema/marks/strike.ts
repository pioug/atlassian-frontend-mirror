import type { MarkSpec } from '@atlaskit/editor-prosemirror/model';
import { strike as strikeFactory } from '../../next-schema/generated/markTypes';

/**
 * @name strike_mark
 */
export interface StrikeDefinition {
	type: 'strike';
}

export const strike: MarkSpec = strikeFactory({
	parseDOM: [
		{ tag: 'strike' },
		{ tag: 's' },
		{ tag: 'del' },
		{
			style: 'text-decoration',
			getAttrs: (value) => value === 'line-through' && null,
		},
	],
	toDOM(): [string] {
		return ['s'];
	},
});
