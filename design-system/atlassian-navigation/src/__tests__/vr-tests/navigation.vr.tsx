import { Device, snapshot } from '@af/visual-regression';

import {
	CustomProductHomeExample,
	NavExample,
	NavigationSkeletonExample,
	ResponsiveCreateHomeAndSearchExample,
	SkeletonButtonsExample,
	ThemedSkeletonButtonsExample,
	ThemingExample,
	ThemingNavigationSkeletonExample,
} from './test-examples';

snapshot(NavExample, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
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
	],
	featureFlags: {
		'platform.design-system-team.icon-button-spacing-fix_o1zc5': true,
	},
});

snapshot(SkeletonButtonsExample, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
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
	],
	featureFlags: {
		'platform.design-system-team.icon-button-spacing-fix_o1zc5': true,
	},
});

snapshot(NavigationSkeletonExample, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
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
	],
});

snapshot(ThemingExample, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
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
	],
	featureFlags: {
		'platform.design-system-team.icon-button-spacing-fix_o1zc5': true,
	},
});

snapshot(ThemingNavigationSkeletonExample);
snapshot(ThemedSkeletonButtonsExample, {
	featureFlags: {
		'platform.design-system-team.icon-button-spacing-fix_o1zc5': true,
	},
});

snapshot(ResponsiveCreateHomeAndSearchExample, {
	variants: [
		{
			name: 'mobile chrome',
			device: Device.MOBILE_CHROME,
		},
		{
			name: 'desktop chrome',
			device: Device.DESKTOP_CHROME,
		},
	],
});

snapshot(CustomProductHomeExample, {
	variants: [
		{
			name: 'mobile chrome',
			device: Device.MOBILE_CHROME,
		},
		{
			name: 'desktop chrome',
			device: Device.DESKTOP_CHROME,
		},
	],
});
