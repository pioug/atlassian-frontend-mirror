import { snapshot } from '@af/visual-regression';

import DisabledExample from '../../../examples/25-disabled';

import { themeVariants } from './utils';

snapshot(DisabledExample, {
	variants: themeVariants,
	featureFlags: {
		'platform.design-system-team.component-visual-refresh_t8zbo': [true, false],
	},
});
