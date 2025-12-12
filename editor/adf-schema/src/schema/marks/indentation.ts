import type { MarkSpec } from '@atlaskit/editor-prosemirror/model';
import { indentation as indentationFactory } from '../../next-schema/generated/markTypes';

export interface IndentationMarkAttributes {
	/**
	 * @minimum 1
	 * @maximum 6
	 */
	level: number;
}

/**
 * @name indentation_mark
 */
export interface IndentationMarkDefinition {
	attrs: IndentationMarkAttributes;
	type: 'indentation';
}

export const indentation: MarkSpec = indentationFactory({
	parseDOM: [
		{
			tag: 'div.fabric-editor-indentation-mark',
			getAttrs(dom) {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const level = +((dom as HTMLElement).getAttribute('data-level') || '0');
				return {
					level: level > 6 ? 6 : level < 1 ? false : level,
				};
			},
		},
	],
	toDOM(mark) {
		return [
			'div',
			{
				class: 'fabric-editor-block-mark fabric-editor-indentation-mark',
				'data-level': mark.attrs.level,
			},
			0,
		];
	},
});
