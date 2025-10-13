/* eslint-disable @atlaskit/design-system/no-dark-theme-vr-tests */
import { snapshot } from '@af/visual-regression';

import AllPlacements from '../../examples/all-placements';
import Card from '../../examples/card';
import FullWidthTarget from '../../examples/full-width-target';
import OverlayingUI from '../../examples/overlaying-ui';
import StepVariants from '../../examples/step-variants';
import NoMedia from '../../examples/without-image';

snapshot(Card, {
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

snapshot(StepVariants, {
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

snapshot(FullWidthTarget, {
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
