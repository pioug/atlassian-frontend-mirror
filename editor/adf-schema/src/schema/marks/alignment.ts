import type { MarkSpec } from '@atlaskit/editor-prosemirror/model';
import { alignment as alignmentFactory } from '../../next-schema/generated/markTypes';

/** TODO: Flip these positions for RTL */
export const alignmentPositionMap: { [key: string]: string } = {
	end: 'right',
	right: 'end',
	center: 'center',
};

export interface AlignmentAttributes {
	align: 'center' | 'end';
}

/**
 * @name alignment_mark
 */
export interface AlignmentMarkDefinition {
	attrs: AlignmentAttributes;
	type: 'alignment';
}

export const alignment: MarkSpec = alignmentFactory({
	parseDOM: [
		{
			tag: 'div.fabric-editor-block-mark',
			getAttrs: (dom) => {
				const align = (dom as Element).getAttribute('data-align');
				return align ? { align } : false;
			},
		},
	],
	toDOM(mark) {
		return [
			'div',
			{
				class: `fabric-editor-block-mark fabric-editor-alignment fabric-editor-align-${mark.attrs.align}`,
				'data-align': mark.attrs.align,
			},
			0,
		];
	},
});
