import { snapshot } from '@af/visual-regression';

import SplitButtonFinesseExample from '../../../examples/95-split-button-finesse.vr.ap';

snapshot(SplitButtonFinesseExample, {
	description: 'Primary SplitButton selected treatment',
	featureFlags: {
		'platform-dst-tokens-finesse': [false, true],
	},
	variants: [{ name: 'Light', environment: { colorScheme: 'light' } }],
});

snapshot(SplitButtonFinesseExample, {
	description: 'Primary SplitButton selected treatment hovered',
	featureFlags: {
		'platform-dst-tokens-finesse': [false, true],
	},
	variants: [{ name: 'Light', environment: { colorScheme: 'light' } }],
	states: [{ state: 'hovered', selector: { byTestId: 'selected-primary-trigger' } }],
});
