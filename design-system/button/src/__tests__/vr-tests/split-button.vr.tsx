import { snapshot } from '@af/visual-regression';

import SplitButtonExample from '../../../examples/95-split-button';

import { themeVariants } from './utils';

snapshot(SplitButtonExample, {
	variants: themeVariants,
	featureFlags: {
		'platform.design-system-team.component-visual-refresh_t8zbo': [true, false],
	},
});
