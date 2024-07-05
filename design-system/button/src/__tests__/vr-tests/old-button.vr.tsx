import { snapshot } from '@af/visual-regression';

import OldButtonExample from '../../../examples/99-appearances-old-button';

import { themeVariants } from './utils';

snapshot(OldButtonExample, {
	description: 'Old button appearances',
	variants: themeVariants,
	featureFlags: {
		'platform.design-system-team.component-visual-refresh_t8zbo': [true, false],
	},
});
