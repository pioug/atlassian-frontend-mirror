import { snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import { default as ColorPicker } from '../../../examples/00-color-picker';
import { default as ColorPalleteMenu } from '../../../examples/05-multi-columns-color-palette-menu';
import { default as CompactColorPaletteMenu } from '../../../examples/06-compact-multi-columns-color-palette-menu';
import { default as ColorPaletteMenuOutline } from '../../../examples/12-color-palette-menu-outline';
import { default as ColorPickerOutlineOpen } from '../../../examples/13-color-picker-outline-open';
import { default as ColorPickerSmallSwatchNoColor } from '../../../examples/07-color-picker-small-size-swatch-with-default-no-color-selected';
import { default as ColorPickerSmallSwatch } from '../../../examples/08-color-picker-small-swatch';

const options: SnapshotTestOptions<Record<string, never>> = {
	drawsOutsideBounds: true,
};

const hoveredOptions: SnapshotTestOptions<Record<string, never>> = {
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'menuitemradio',
				options: {
					name: 'Purple',
					exact: true,
				},
			},
		},
	],
	drawsOutsideBounds: true,
};

snapshot(ColorPicker, options);
snapshot(ColorPalleteMenu, hoveredOptions);
snapshot(CompactColorPaletteMenu, hoveredOptions);
snapshot(ColorPickerSmallSwatchNoColor, options);
snapshot(ColorPickerSmallSwatch, options);
snapshot(ColorPaletteMenuOutline, hoveredOptions);
snapshot(ColorPickerOutlineOpen, options);
