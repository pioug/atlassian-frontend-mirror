import { MarkSpec } from 'prosemirror-model';
import { hexToEditorBorderPaletteColor } from '@atlaskit/editor-palette';
import { N300A, N600, N1000 } from '../../utils/colors';

export type BorderMarkAttributes = {
  /**
   * @minimum 1
   * @maximum 3
   */
  size: number;
  /**
   * @pattern "^#[0-9a-fA-F]{8}$|^#[0-9a-fA-F]{6}$"
   */
  color: string;
};

/**
 * @name border_mark
 * @description This mark adds decoration to an element, and any element decorated with it will also have a border style.
 */
export interface BorderMarkDefinition {
  type: 'border';
  attrs: BorderMarkAttributes;
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

export const border: MarkSpec = {
  inclusive: false,
  parseDOM: [
    {
      tag: 'div[data-mark-type="border"]',
      getAttrs: (domNode) => {
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
  attrs: { color: {}, size: {} },
  toDOM(mark) {
    // Note -- while there is no way to create custom colors using default tooling
    // the editor does supported ad hoc color values -- and there may be content
    // which has been migrated or created via apis which use such values.
    const paletteColorValue =
      hexToEditorBorderPaletteColor(mark.attrs.color) || mark.attrs.color;
    return [
      'div',
      {
        'data-mark-type': 'border',
        'data-color': mark.attrs.color,
        'data-size': mark.attrs.size,
        style: `--custom-palette-color: ${paletteColorValue}`,
      },
    ];
  },
};
