import { snapshot } from '@af/visual-regression';

import AnchorDefault from '../../../../examples/44-anchor-default';
import AnchorStyled from '../../../../examples/45-anchor-styled';
import AnchorNewWindow from '../../../../examples/47-anchor-new-window';

snapshot(AnchorDefault, {
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

snapshot(AnchorDefault, {
	description: 'Hovered',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'anchor-default' },
		},
	],
});

snapshot(AnchorDefault, {
	description: 'Focused',
	states: [
		{
			state: 'focused',
			selector: { byTestId: 'anchor-default' },
		},
	],
});

snapshot(AnchorStyled, {
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

snapshot(AnchorNewWindow, {
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
