import { snapshot } from '@af/visual-regression';

import { CompositionVR } from '../../../examples/composition.vr.ap';

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
		platform_dst_nav4_skip_link_a11y_1: false,
	},
});

snapshot(CompositionVR, {
	description: 'skip links with accessibility improvements',
	variants: [
		{
			name: 'Light mode',
			environment: { colorScheme: 'light' },
		},
	],
	states: [{ state: 'focused', selector: { byRole: 'link', options: { name: 'Sidebar' } } }],
	featureFlags: {
		platform_dst_nav4_skip_link_a11y_1: true,
		platform_dst_nav4_skip_link_menu_placeholder: false,
	},
});
