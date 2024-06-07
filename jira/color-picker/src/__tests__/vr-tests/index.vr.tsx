import { snapshot, type SnapshotTestOptions } from '@af/visual-regression';

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
};

snapshot(ColorPicker, { ...options, featureFlags });
snapshot(ColorPalleteMenu, { ...options, featureFlags });
snapshot(CompactColorPaletteMenu, { ...options, featureFlags });
snapshot(ColorPickerSmallSwatchNoColor, { ...options, featureFlags });
//Flaky test https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/%7Ba57b6951-6d4d-4674-83cf-0ae6fa67061b%7D/steps/%7Bc0fee4a9-80b1-49f8-878d-b673cf4737fd%7D/test-report
snapshot.skip(ColorPickerSmallSwatch, { ...options, featureFlags });
