import { snapshot } from '@af/visual-regression';

import RenderAllTypes from '../../examples/vr/render-all-types-vr';

snapshot(RenderAllTypes, {
	description: 'Render all types',
	featureFlags: {
		'bandicoots-compiled-migration-link-datasource': [true, false],
		'platform-component-visual-refresh': [true, false],
	},
});
