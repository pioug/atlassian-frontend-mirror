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
	featureFlags: {},
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
});

snapshot(HoverCardUnauthorised, {
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-card-trigger-wrapper' },
		},
	],
});

snapshot(HoverCardSSRLoading, {
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-card-trigger-wrapper' },
		},
	],
});

snapshot(HoverCardSSRError, {
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-card-trigger-wrapper' },
		},
	],
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
});
