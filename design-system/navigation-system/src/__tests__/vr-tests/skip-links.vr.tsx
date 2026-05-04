import { snapshot } from '@af/visual-regression';

import { CompositionVR } from '../../../examples/composition';

snapshot(CompositionVR, {
	description: 'skip links',
	variants: [
		{
			name: 'Light mode',
			environment: { colorScheme: 'light' },
		},
	],
	states: [{ state: 'focused', selector: { byRole: 'link', options: { name: 'Sidebar' } } }],
	featureFlags: {
		// When enabled, the skip links are rendered in a popup dialog
		platform_dst_nav4_skip_link_a11y_1: false,
	},
});
