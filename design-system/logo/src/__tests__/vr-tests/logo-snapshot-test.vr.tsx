import { snapshot } from '@af/visual-regression';

// Import all examples
import Basic from '../../../examples/0-basic.vr.ap';
import Appearance from '../../../examples/1-appearance.vr.ap';
import Sizes from '../../../examples/5-sizes.vr.ap';
import DefensiveStyling from '../../../examples/6-defensive-styling.vr.ap';

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
