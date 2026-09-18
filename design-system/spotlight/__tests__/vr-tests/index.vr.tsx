/* eslint-disable @atlaskit/design-system/no-dark-theme-vr-tests */

import { snapshot } from '@af/visual-regression';

import Links from '../../examples/action-links.vr.ap';
import AllPlacements from '../../examples/all-placements.vr.ap';
import Card from '../../examples/card.vr.ap';
import FullWidthTarget from '../../examples/full-width-target.vr.ap';
import Offset from '../../examples/offset.vr.ap';
import OnModal from '../../examples/on-modal.vr.ap';
import OverlayingUI from '../../examples/overlaying-ui.vr.ap';
import Reflow from '../../examples/reflow.vr.ap';
import StepVariants from '../../examples/step-variants.vr.ap';
import NoMedia from '../../examples/without-image.vr.ap';

snapshot(Card, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'platform-dst-top-layer-spotlight': true,
		platform_spotlight_card_fit_content_anchor: true,
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
		'platform-dst-top-layer-spotlight': true,
		platform_spotlight_card_fit_content_anchor: true,
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
		'platform-dst-top-layer-spotlight': true,
		platform_spotlight_card_fit_content_anchor: true,
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
		'platform-dst-top-layer-spotlight': true,
		platform_spotlight_card_fit_content_anchor: true,
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
		'platform-dst-top-layer-spotlight': true,
		platform_spotlight_card_fit_content_anchor: true,
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
		'platform-dst-top-layer-spotlight': true,
		platform_spotlight_card_fit_content_anchor: true,
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
snapshot(Offset, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'platform-dst-top-layer-spotlight': true,
		platform_spotlight_card_fit_content_anchor: true,
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
snapshot(Links, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'platform-dst-top-layer-spotlight': true,
		platform_spotlight_card_fit_content_anchor: true,
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
snapshot(OnModal, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'platform-dst-top-layer-spotlight': true,
		platform_spotlight_card_fit_content_anchor: true,
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
snapshot(Reflow, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'platform-dst-top-layer-spotlight': true,
		platform_spotlight_card_fit_content_anchor: true,
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
