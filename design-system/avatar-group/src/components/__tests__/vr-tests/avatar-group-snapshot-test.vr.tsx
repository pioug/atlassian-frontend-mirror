import { snapshot } from '@af/visual-regression';

import BasicAvatarGroup from '../../../../examples/02-basic-avatar-group';
import BorderColorExample from '../../../../examples/03-avatar-group-border-color';
import AvatarGroupPlayground from '../../../../examples/10-avatar-group-playground';
import OverridesMoreIndicatorExample from '../../../../examples/30-overrides-more-indicator';
import VRStackingContextExample from '../../../../examples/vr-stacking-context';

snapshot(BasicAvatarGroup, {
	states: [
		{
			state: 'focused',
			selector: { byTestId: 'stack--avatar-2--inner' },
		},
	],
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

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
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
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
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(BorderColorExample, {
	description: 'Border colors should be visible for avatars in avatar group',
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(VRStackingContextExample, {
	description:
		'Avatar group should create a new stacking context so that avatars do not pop in front of floating items',
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(OverridesMoreIndicatorExample, {
	description: 'More indicator should display override',
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
