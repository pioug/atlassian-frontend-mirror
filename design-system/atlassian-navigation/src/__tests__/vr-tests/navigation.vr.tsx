import { Device, snapshot } from '@af/visual-regression';

import {
	CustomProductHomeExample,
	NavExample,
	NavExampleAppHome,
	NavigationSkeletonExample,
	ResponsiveCreateHomeAndSearchExample,
	SkeletonButtonsExample,
	ThemedSkeletonButtonsExample,
	ThemingAppHomeExample,
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

snapshot(NavExampleAppHome, {
	variants: [
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
			name: 'mobile chrome',
			device: Device.MOBILE_CHROME,
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: { 'platform-team25-app-icon-tiles': [true, false] },
});

snapshot(ThemingAppHomeExample, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'mobile chrome',
			device: Device.MOBILE_CHROME,
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: { 'platform-team25-app-icon-tiles': [true] },
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
