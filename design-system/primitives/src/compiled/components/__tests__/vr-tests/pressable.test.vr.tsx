// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import PressableDefault from '../../../../../examples/41-pressable-default-compiled';
import PressableStyled from '../../../../../examples/42-pressable-styled-compiled';

snapshot(PressableDefault, {
	variants: [
		{
			name: 'Default',
			environment: {},
		},
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(PressableDefault, {
	description: 'Hovered',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'pressable-default' },
		},
	],
});

snapshot(PressableDefault, {
	description: 'Focused',
	states: [
		{
			state: 'focused',
			selector: { byTestId: 'pressable-default' },
		},
	],
});

snapshot(PressableStyled, {
	variants: [
		{
			name: 'Default',
			environment: {},
		},
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
