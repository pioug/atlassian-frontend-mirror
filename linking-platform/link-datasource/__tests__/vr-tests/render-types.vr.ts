import { snapshot } from '@af/visual-regression';

import RenderAllTypes from '../../examples/vr/render-all-types-vr';

snapshot(RenderAllTypes, {
	description: 'Render all types',
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		featureFlags: {
			'platform-linking-visual-refresh-sllv': [true, false],
		},
	},
});
