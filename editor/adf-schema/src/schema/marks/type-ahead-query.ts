import type { MarkSpec } from '@atlaskit/editor-prosemirror/model';
import { typeAheadQuery as typeAheadQueryFactory } from '../../next-schema/generated/markTypes';
import { B400 } from '../../utils/colors';

export const typeAheadQuery: MarkSpec = typeAheadQueryFactory({
	parseDOM: [{ tag: 'span[data-type-ahead-query]' }],
	toDOM(node) {
		return [
			'span',
			{
				'data-type-ahead-query': 'true',
				'data-trigger': node.attrs.trigger,
				style: `color: ${B400}`,
			},
		];
	},
});
