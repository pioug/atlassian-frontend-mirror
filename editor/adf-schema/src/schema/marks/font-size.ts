import type { MarkSpec } from '@atlaskit/editor-prosemirror/model';
import { fontSize as fontSizeFactory } from '../../next-schema/generated/markTypes';

const allowedSizes = ['small'];

export type FontSizeMarkAttrs = {
	fontSize: 'small';
};

/**
 * @name fontSize_mark
 */
export interface FontSizeMarkDefinition {
	attrs: FontSizeMarkAttrs;
	type: 'fontSize';
}

export const fontSize: MarkSpec = fontSizeFactory({
	parseDOM: [
		{
			tag: 'div.fabric-editor-font-size',
			getAttrs(dom) {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const fontSize = (dom as HTMLElement).getAttribute('data-font-size');

				return {
					fontSize: allowedSizes.indexOf(fontSize || '') === -1 ? 'small' : fontSize,
				};
			},
		},
	],
	toDOM(mark) {
		return [
			'div',
			{
				class: 'fabric-editor-block-mark fabric-editor-font-size',
				'data-font-size': mark.attrs.fontSize,
			},
			0,
		];
	},
});
