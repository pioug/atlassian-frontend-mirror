import { snapshot } from '@af/visual-regression';

import CustomThemeVr from '../../../examples/9-custom-theme.vr.ap';

snapshot(CustomThemeVr, {
	variants: [
		{
			name: 'Default',
			environment: {},
		},
	],
});
