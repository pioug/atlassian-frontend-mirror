import { snapshot } from '@af/visual-regression';

import HoverCardActions from '../../../examples/vr-hover-card/vr-hover-card-actions.vr.ap';
import HoverCardPositioning from '../../../examples/vr-hover-card/vr-hover-card-can-open-positioning.vr.ap';
import HoverCardWithEntities from '../../../examples/vr-hover-card/vr-hover-cards-entities.vr.ap';
import HoverCardSSRError from '../../../examples/vr-hover-card/vr-hover-cards-ssr-error.vr.ap';
import HoverCardSSRLoading from '../../../examples/vr-hover-card/vr-hover-cards-ssr-loading.vr.ap';
import HoverCard from '../../../examples/vr-hover-card/vr-hover-cards.vr.ap';
import HoverCardUnauthorised from '../../../examples/vr-hover-card/vr-unauthorised-hover-cards.vr.ap';

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
	waitForReactLazy: true,
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
	waitForReactLazy: true,
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
	waitForReactLazy: true,
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
	waitForReactLazy: true,
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
		platform_sl_3p_preauth_better_hovercard_killswitch: true,
		platform_sl_3p_preauth_better_hovercard: [true, false],
	},
	waitForReactLazy: true,
});

snapshot(HoverCardSSRLoading, {
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-card-trigger-wrapper' },
		},
	],
	waitForReactLazy: true,
});

snapshot(HoverCardSSRError, {
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-card-trigger-wrapper' },
		},
	],
	waitForReactLazy: true,
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
	waitForReactLazy: true,
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
	waitForReactLazy: true,
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
	waitForReactLazy: true,
});
