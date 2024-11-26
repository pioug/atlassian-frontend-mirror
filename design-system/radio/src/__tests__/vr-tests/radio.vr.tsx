import { snapshot } from '@af/visual-regression';

import RadioExample from '../../../examples/02-form-example';

snapshot(RadioExample, {
	description: 'Legacy style',
});

snapshot(RadioExample, {
	description: 'Visual refresh style',
	featureFlags: {
		'platform-visual-refresh-icons': true,
		'platform-icon-control-migration': true,
	},
});
