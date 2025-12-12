import type { MarkSpec } from '@atlaskit/editor-prosemirror/model';
import { border as borderFactory } from '../../next-schema/generated/markTypes';
import { hexToEditorBorderPaletteColor } from '../../utils/editor-palette';
import { N300A, N600, N1000 } from '../../utils/colors';

export type BorderMarkAttributes = {
	/**
	 * @pattern "^#[0-9a-fA-F]{8}$|^#[0-9a-fA-F]{6}$"
	 */
	color: string;
	/**
	 * @minimum 1
	 * @maximum 3
	 */
	size: number;
};

/**
 * @name border_mark
 * @description This mark adds decoration to an element, and any element decorated with it will also have a border style.
 */
export interface BorderMarkDefinition {
	attrs: BorderMarkAttributes;
	type: 'border';
}

export type BorderColorKey = 'Subtle gray' | 'Gray' | 'Bold gray';

const borderColorArrayPalette: Array<[string, BorderColorKey]> = [
	[N300A, 'Subtle gray'],
	[N600, 'Gray'],
	[N1000, 'Bold gray'],
];

export const borderColorPalette = new Map<string, BorderColorKey>();

borderColorArrayPalette.forEach(([color, label]) =>
	borderColorPalette.set(color.toLowerCase(), label),
);

export const border: MarkSpec = borderFactory({
	parseDOM: [
		{
			tag: '[data-mark-type="border"]',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				const color = (dom.getAttribute('data-color') ?? '').toLowerCase();
				const size = +(dom.getAttribute('data-size') ?? '0');

				return {
					size: size > 3 ? 3 : size < 1 ? false : size,
					color: borderColorPalette.has(color) ? color : false,
				};
			},
		},
	],
	toDOM(mark, isInline) {
		const wrapperStyle = isInline ? 'span' : 'div';

		// Note -- while there is no way to create custom colors using default tooling
		// the editor does supported ad hoc color values -- and there may be content
		// which has been migrated or created via apis which use such values.
		const paletteColorValue = hexToEditorBorderPaletteColor(mark.attrs.color) || mark.attrs.color;
		return [
			wrapperStyle,
			{
				'data-mark-type': 'border',
				'data-color': mark.attrs.color,
				'data-size': mark.attrs.size,
				style: `--custom-palette-color: ${paletteColorValue}`,
			},
		];
	},
});
