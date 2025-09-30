import { snapshot } from '@af/visual-regression';

import BasicAvatar from '../../../examples/01-basic-avatar';
import InteractiveAvatar from '../../../examples/09-basic-avatar-interactive';

snapshot(BasicAvatar, {
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-visual-refresh-icons': true,
		platform_dst_avatar_tile: [true, false],
	},
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
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

snapshot(BasicAvatar, {
	description: 'tooltip on hover',
	states: [{ state: 'hovered', selector: { byTestId: 'avatar' } }],
	drawsOutsideBounds: true,
});

snapshot(InteractiveAvatar, {
	description: 'interactive avatar with focus-ring',
	states: [{ state: 'focused', selector: { byTestId: 'avatar--inner' } }],
});
