import { snapshot, SnapshotTestOptions } from '@af/visual-regression';

import { default as ColorPicker } from '../../../examples/00-color-picker';
import { default as ColorPalleteMenu } from '../../../examples/05-multi-columns-color-palette-menu';
import { default as CompactColorPaletteMenu } from '../../../examples/06-compact-multi-columns-color-palette-menu';
import { default as ColorPickerSmallSwatchNoColor } from '../../../examples/07-color-picker-small-size-swatch-with-default-no-color-selected';
import { default as ColorPickerSmallSwatch } from '../../../examples/08-color-picker-small-swatch';

const options: SnapshotTestOptions<{}> = {
  variants: [
    {
      name: 'light mode',
      environment: {
        colorScheme: 'light',
      },
    },
    {
      name: 'dark mode',
      environment: {
        colorScheme: 'dark',
      },
    },
  ],
};

const featureFlags = {
  'platform.color-picker-radio-button-functionality_6hkcy': true,
  'platform.design-system-team.update-input-border-wdith_5abwv': true,
  'platform.design-tokens-color-picker-portfolio-plan-wizard_w8rcl': true,
};

snapshot(ColorPicker, { ...options, featureFlags });
snapshot(ColorPalleteMenu, { ...options, featureFlags });
snapshot(CompactColorPaletteMenu, { ...options, featureFlags });
snapshot(ColorPickerSmallSwatchNoColor, { ...options, featureFlags });
snapshot(ColorPickerSmallSwatch, { ...options, featureFlags });
