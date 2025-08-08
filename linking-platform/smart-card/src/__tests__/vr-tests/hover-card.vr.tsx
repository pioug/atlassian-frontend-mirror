import { snapshot } from '@af/visual-regression';

import HoverCardActions from '../../../examples/vr-hover-card/vr-hover-card-actions';
import HoverCardPositioning from '../../../examples/vr-hover-card/vr-hover-card-can-open-positioning';
import HoverCard from '../../../examples/vr-hover-card/vr-hover-cards';
import HoverCardWithEntities from '../../../examples/vr-hover-card/vr-hover-cards-entities';
import HoverCardSSRError from '../../../examples/vr-hover-card/vr-hover-cards-ssr-error';
import HoverCardSSRLoading from '../../../examples/vr-hover-card/vr-hover-cards-ssr-loading';
import HoverCardUnauthorised from '../../../examples/vr-hover-card/vr-unauthorised-hover-cards';

snapshot(HoverCard, {
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-card-trigger-wrapper' },
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
	featureFlags: {},
});

snapshot(HoverCardWithEntities, {
	description: 'hover-card: Entities support',
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-card-trigger-wrapper' },
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
	featureFlags: {
		smart_links_noun_support: true,
	},
});

snapshot(HoverCardActions, {
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-card-trigger-wrapper' },
		},
	],
	variants: [{ name: 'light mode', environment: { colorScheme: 'light' } }],
	featureFlags: {},
});

snapshot(HoverCardActions, {
	description: 'Hover card actions with related urls',
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-card-trigger-wrapper' },
		},
	],
	featureFlags: {},
});

snapshot(HoverCardUnauthorised, {
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-card-trigger-wrapper' },
		},
	],
	featureFlags: {
		'platform-smart-card-remove-legacy-button': true,
	},
});

snapshot(HoverCardSSRLoading, {
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-card-trigger-wrapper' },
		},
	],
	featureFlags: {},
});

snapshot(HoverCardSSRError, {
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-card-trigger-wrapper' },
		},
	],
	featureFlags: {},
});

snapshot(HoverCardPositioning, {
	description: 'hover-card: can open in left position',
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-test-can-open-left' },
		},
	],
	featureFlags: {},
});

snapshot(HoverCardPositioning, {
	description: 'hover-card: can not open when disabled',
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-test-cannot-open' },
		},
	],
	featureFlags: {},
});

snapshot(HoverCardPositioning, {
	description: 'hover-card: can open in right position',
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-test-can-open-right' },
		},
	],
	featureFlags: {},
});
