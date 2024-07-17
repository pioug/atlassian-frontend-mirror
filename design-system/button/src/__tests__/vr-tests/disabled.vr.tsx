import { snapshot } from '@af/visual-regression';

import DisabledExample from '../../../examples/25-disabled';

import { themeVariants } from './utils';

snapshot(DisabledExample, {
	variants: themeVariants,
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
