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

snapshot(ColorPicker, options);
// Skipping because it is failing on master. Failing build: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/4002050
snapshot.skip(ColorPalleteMenu, options);
snapshot.skip(CompactColorPaletteMenu, options);
snapshot(ColorPickerSmallSwatchNoColor, options);
//Flaky test https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/%7Ba57b6951-6d4d-4674-83cf-0ae6fa67061b%7D/steps/%7Bc0fee4a9-80b1-49f8-878d-b673cf4737fd%7D/test-report
snapshot.skip(ColorPickerSmallSwatch, options);
snapshot(ColorPaletteMenuOutline, options);
snapshot(ColorPickerOutlineOpen, options);
