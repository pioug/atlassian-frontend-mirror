import { snapshot } from '@af/visual-regression';

import BasicAvatar from '../../../examples/01-basic-avatar.vr.ap';
import InteractiveAvatar from '../../../examples/10-basic-avatar-interactive.vr.ap';

snapshot(BasicAvatar, {
	drawsOutsideBounds: true,
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
	featureFlags: {
		platform_editor_agent_mentions_drop_one_fixes: [false, true],
	},
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

snapshot(InteractiveAvatar, {
	description: 'interactive hexagon avatar with focus-ring',
	states: [{ state: 'focused', selector: { byTestId: 'avatar-hexagon--inner' } }],
	featureFlags: {
		platform_editor_agent_mentions_drop_one_fixes: [false, true],
	},
});
