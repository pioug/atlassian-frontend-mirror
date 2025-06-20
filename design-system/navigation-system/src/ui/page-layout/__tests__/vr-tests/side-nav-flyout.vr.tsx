import { Device, type Hooks, snapshot } from '@af/visual-regression';
import type { SnapshotTestOptions } from '@atlassian/gemini';

import {
	CollapsedVR,
	CollapsedWithOpenLayerVR,
	ExpandedVR,
	ExpandedWithOpenLayerVR,
} from '../../../../../examples/side-nav-flyout';

const defaultOptions: SnapshotTestOptions<Hooks> = {
	drawsOutsideBounds: true,
	variants: [
		{
			device: Device.MOBILE_CHROME,
			environment: { colorScheme: 'light' },
			name: 'mobile',
		},
		{
			device: Device.DESKTOP_CHROME,
			environment: { colorScheme: 'light' },
			name: 'desktop',
		},
	],
};

snapshot(CollapsedVR, {
	...defaultOptions,
	description: 'Side nav default collapsed',
});

snapshot(CollapsedVR, {
	...defaultOptions,
	description: 'Side nav default collapsed, toggle button hovered',
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'button',
				options: {
					name: 'Expand sidebar',
				},
			},
		},
	],
});

snapshot(CollapsedWithOpenLayerVR, {
	...defaultOptions,
	description: 'Side nav default collapsed, with open child layer',
});

snapshot(CollapsedWithOpenLayerVR, {
	...defaultOptions,
	description: 'Side nav default collapsed, with open child layer, toggle button hovered',
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'button',
				options: {
					name: 'Expand sidebar',
				},
			},
		},
	],
});

snapshot(ExpandedVR, {
	...defaultOptions,
	description: 'Side nav default expanded',
});

// We have separate snapshot configs for desktop and mobile because the toggle button tooltip is different
snapshot(ExpandedVR, {
	...defaultOptions,
	description: 'Side nav default expanded, toggle button hovered',
	variants: [
		{
			device: Device.DESKTOP_CHROME,
			environment: { colorScheme: 'light' },
			name: 'desktop',
		},
	],
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'button',
				options: {
					name: 'Collapse sidebar',
				},
			},
		},
	],
});

snapshot(ExpandedVR, {
	...defaultOptions,
	description: 'Side nav default expanded, toggle button hovered',
	variants: [
		{
			device: Device.MOBILE_CHROME,
			environment: { colorScheme: 'light' },
			name: 'mobile',
		},
	],
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'button',
				options: {
					name: 'Expand sidebar',
				},
			},
		},
	],
});

snapshot(ExpandedWithOpenLayerVR, {
	...defaultOptions,
	description: 'Side nav default expanded, with open child layer',
});

// We have separate snapshot configs for desktop and mobile because the toggle button tooltip is different
snapshot(ExpandedWithOpenLayerVR, {
	...defaultOptions,
	description: 'Side nav default expanded, with open child layer, toggle button hovered',
	variants: [
		{
			device: Device.DESKTOP_CHROME,
			environment: { colorScheme: 'light' },
			name: 'desktop',
		},
	],
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'button',
				options: {
					name: 'Collapse sidebar',
				},
			},
		},
	],
});
snapshot(ExpandedWithOpenLayerVR, {
	...defaultOptions,
	description: 'Side nav default expanded, with open child layer, toggle button hovered',
	variants: [
		{
			device: Device.MOBILE_CHROME,
			environment: { colorScheme: 'light' },
			name: 'mobile',
		},
	],
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'button',
				options: {
					name: 'Expand sidebar',
				},
			},
		},
	],
});
