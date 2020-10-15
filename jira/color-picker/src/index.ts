import ColorPicker from './components/ColorPicker';
import { Mode } from './types';

const { Compact, Standard } = Mode;

export { ColorPickerWithoutAnalytics } from './components/ColorPicker';
export type { Props as ColorPickerProps } from './components/ColorPicker';

export { ColorPaletteMenuWithoutAnalytics } from './components/ColorPaletteMenu';
export type { Props as ColorPaletteMenuProps } from './components/ColorPaletteMenu';

export default ColorPicker;
export { default as ColorPaletteMenu } from './components/ColorPaletteMenu';
export { Standard, Compact };
