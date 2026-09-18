import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as ColorPickerVrExample } from './00-color-picker.vr.ap';
import { default as MultiColumnsColorPickerExample } from './01-multi-columns-color-picker';
import { default as ColorPickerWithPopperPropsExample } from './02-color-picker-with-popper-props';
import { default as ColorPaletteMenuExample } from './04-color-palette-menu';
import { default as MultiColumnsColorPaletteMenuVrExample } from './05-multi-columns-color-palette-menu.vr.ap';
import { default as CompactMultiColumnsColorPaletteMenuVrExample } from './06-compact-multi-columns-color-palette-menu.vr.ap';
import { default as ColorPickerSmallSizeSwatchWithDefaultNoColorSelectedVrExample } from './07-color-picker-small-size-swatch-with-default-no-color-selected.vr.ap';
import { default as ColorPickerSmallSwatchVrExample } from './08-color-picker-small-swatch.vr.ap';
import { default as ColorPaletteMenuNotInsideMenuExample } from './09-color-palette-menu-not-inside-menu';
import { default as ColorPickerOpenExample } from './10-color-picker-open';
import { default as ColorPickerOutlineExample } from './11-color-picker-outline';
import { default as ColorPaletteMenuOutlineVrExample } from './12-color-palette-menu-outline.vr.ap';
import { default as ColorPickerOutlineOpenVrExample } from './13-color-picker-outline-open.vr.ap';

export const ColorPickerVr: WorkbenchExample = wb(ColorPickerVrExample);
export const MultiColumnsColorPicker: WorkbenchExample = wb(MultiColumnsColorPickerExample);
export const ColorPickerWithPopperProps: WorkbenchExample = wb(ColorPickerWithPopperPropsExample);
export const ColorPaletteMenu: WorkbenchExample = wb(ColorPaletteMenuExample);
export const MultiColumnsColorPaletteMenuVr: WorkbenchExample = wb(
	MultiColumnsColorPaletteMenuVrExample,
);
export const CompactMultiColumnsColorPaletteMenuVr: WorkbenchExample = wb(
	CompactMultiColumnsColorPaletteMenuVrExample,
);
export const ColorPickerSmallSizeSwatchWithDefaultNoColorSelectedVr: WorkbenchExample = wb(
	ColorPickerSmallSizeSwatchWithDefaultNoColorSelectedVrExample,
);
export const ColorPickerSmallSwatchVr: WorkbenchExample = wb(ColorPickerSmallSwatchVrExample);
export const ColorPaletteMenuNotInsideMenu: WorkbenchExample = wb(
	ColorPaletteMenuNotInsideMenuExample,
);
export const ColorPickerOpen: WorkbenchExample = wb(ColorPickerOpenExample);
export const ColorPickerOutline: WorkbenchExample = wb(ColorPickerOutlineExample);
export const ColorPaletteMenuOutlineVr: WorkbenchExample = wb(ColorPaletteMenuOutlineVrExample);
export const ColorPickerOutlineOpenVr: WorkbenchExample = wb(ColorPickerOutlineOpenVrExample);
