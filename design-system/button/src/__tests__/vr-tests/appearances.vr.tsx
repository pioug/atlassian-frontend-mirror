import { snapshot } from '@af/visual-regression';

import AppearancesExample from '../../../examples/15-appearances';

import { themeVariants } from './utils';

snapshot(AppearancesExample, {
	variants: themeVariants,
	featureFlags: {
		'platform.design-system-team.component-visual-refresh_t8zbo': [true, false],
	},
});
