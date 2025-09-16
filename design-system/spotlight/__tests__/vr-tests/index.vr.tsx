/* eslint-disable @atlaskit/design-system/no-dark-theme-vr-tests */
import { snapshot } from '@af/visual-regression';

import AllPlacements from '../../examples/all-placements';
import Basic from '../../examples/basic';
import MultiStep from '../../examples/multi-step';
import OverlayingUI from '../../examples/overlaying-ui';
import NoMedia from '../../examples/without-image';

snapshot(Basic, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'Dark',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
});

snapshot(MultiStep, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(NoMedia, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(AllPlacements, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(OverlayingUI, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
