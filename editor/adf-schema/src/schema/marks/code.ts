import type { MarkSpec } from '@atlaskit/editor-prosemirror/model';
import { code as codeFactory } from '../../next-schema/generated/markTypes';

/**
 * @name code_mark
 */
export interface CodeDefinition {
	type: 'code';
}

export const code: MarkSpec = codeFactory({
	parseDOM: [
		{ tag: 'span.code', preserveWhitespace: true },
		{ tag: 'code', preserveWhitespace: true },
		{ tag: 'tt', preserveWhitespace: true },
		{
			tag: 'span',
			preserveWhitespace: true,
			getAttrs: (domNode) => {
				const dom = domNode as HTMLSpanElement;
				if (dom.style.whiteSpace === 'pre') {
					return {};
				}
				if (dom.style.fontFamily && dom.style.fontFamily.toLowerCase().indexOf('monospace') >= 0) {
					return {};
				}
				return false;
			},
		},
	],
	toDOM() {
		return [
			'span',
			{
				class: 'code',
				spellcheck: 'false',
			},
		];
	},
});
