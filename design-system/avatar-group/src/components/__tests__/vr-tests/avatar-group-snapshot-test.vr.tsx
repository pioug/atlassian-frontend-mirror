import { snapshot } from '@af/visual-regression';

import AvatarGroupPlayground from '../../../../examples/10-avatar-group-playground';

snapshot(AvatarGroupPlayground, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
			},
		},
		{
			name: 'none',
			environment: {
				colorScheme: 'no-preference',
			},
		},
	],
});
snapshot(AvatarGroupPlayground, {
	description: 'More indicator should get outline on focus',
	states: [
		{
			state: 'focused',
			selector: { byTestId: 'grid--overflow-menu--trigger' },
		},
	],
});
snapshot(AvatarGroupPlayground, {
	description: 'More indicator should get opacity onHover',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'grid--overflow-menu--trigger' },
		},
	],
});
