import { snapshot } from '@af/visual-regression';

// Import all examples
import Basic from '../../../examples/0-basic';
import Appearance from '../../../examples/1-appearance';
import Sizes from '../../../examples/5-sizes';
import DefensiveStyling from '../../../examples/6-defensive-styling';

// Test basic examples
snapshot(Basic);
snapshot(Appearance, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(Sizes);
snapshot(DefensiveStyling);
