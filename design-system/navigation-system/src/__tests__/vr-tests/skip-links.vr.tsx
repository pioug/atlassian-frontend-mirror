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
	states: [{ state: 'focused', selector: { byRole: 'link', options: { name: 'Banner' } } }],
});
