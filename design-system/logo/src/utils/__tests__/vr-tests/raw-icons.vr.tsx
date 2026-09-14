import { snapshot } from '@af/visual-regression';

import RawIconsExample from '../../../../examples/internal-logo-component/05-raw-icons.vr.ap';

snapshot(RawIconsExample, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
