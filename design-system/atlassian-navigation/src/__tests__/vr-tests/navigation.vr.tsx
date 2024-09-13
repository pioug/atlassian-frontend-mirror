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
	],
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
	],
	featureFlags: {
		'platform-component-visual-refresh': true,
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
	],
});

snapshot(ThemingNavigationSkeletonExample);
snapshot(ThemedSkeletonButtonsExample);

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
