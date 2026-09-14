import { snapshot } from '@af/visual-regression';

import OldButtonExample from '../../../examples/99-appearances-old-button.vr.ap';

import { themeVariants } from './utils';

snapshot(OldButtonExample, {
	description: 'Old button appearances',
	variants: themeVariants,
});

snapshot(OldButtonExample, {
	description: 'Old button default hovered',
	featureFlags: {
		'platform-dst-tokens-finesse': [false, true],
	},
	states: [
		{
			state: 'hovered',
			selector: { byRole: 'button', options: { name: 'Default', exact: true } },
		},
	],
	variants: themeVariants,
});
