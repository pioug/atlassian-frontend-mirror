import { snapshot } from '@af/visual-regression';

import IconSizing from '../../../examples/icon-sizing.vr.ap';

snapshot(IconSizing, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
