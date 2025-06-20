import { Device, type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import {
	MainContentBorderThemingDisabledSideNavCollapsedVR,
	MainContentBorderThemingDisabledVR,
	MainContentBorderThemingEnabledFullScreenVR,
	MainContentBorderThemingEnabledSideNavCollapsedVR,
	MainContentBorderThemingEnabledVR,
} from '../../../../../examples/main-content-border';

const defaultOptions: SnapshotTestOptions<Hooks> = {
	drawsOutsideBounds: true,
	variants: [
		{
			device: Device.DESKTOP_CHROME,
			environment: { colorScheme: 'light' },
			name: 'desktop',
		},
		{
			device: Device.MOBILE_CHROME,
			environment: { colorScheme: 'light' },
			name: 'mobile',
		},
	],
};

snapshot(MainContentBorderThemingEnabledVR, {
	...defaultOptions,
	description: 'Main content border - theming enabled',
});
snapshot(MainContentBorderThemingDisabledVR, {
	...defaultOptions,
	description: 'Main content border - theming disabled',
});

snapshot(MainContentBorderThemingEnabledSideNavCollapsedVR, {
	...defaultOptions,
	description: 'Main content border - theming enabled, side nav collapsed',
});
snapshot(MainContentBorderThemingDisabledSideNavCollapsedVR, {
	...defaultOptions,
	description: 'Main content border - theming disabled, side nav collapsed',
});
snapshot(MainContentBorderThemingEnabledFullScreenVR, {
	...defaultOptions,
	description: 'Main content border - theming enabled, full screen mode',
});
