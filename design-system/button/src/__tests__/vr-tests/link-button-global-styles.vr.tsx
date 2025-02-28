import { snapshot } from '@af/visual-regression';

import LinkButtonGlobalStylesExample from '../../../examples/80-link-button-global-styles';

snapshot(LinkButtonGlobalStylesExample, {
	description: 'LinkButton - Default appearance - Hovered',
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	states: [
		{
			state: 'hovered',
			selector: { byTestId: `LinkButton-default` },
		},
	],
});

snapshot(LinkButtonGlobalStylesExample, {
	description: 'LinkButton - Default appearance - Focused',
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	states: [
		{
			state: 'focused',
			selector: { byTestId: `LinkButton-default` },
		},
	],
});

snapshot(LinkButtonGlobalStylesExample, {
	description: 'LinkButton - Default appearance - Selected - Hovered',
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	states: [
		{
			state: 'hovered',
			selector: { byTestId: `LinkButton-default-selected` },
		},
	],
});

snapshot(LinkButtonGlobalStylesExample, {
	description: 'LinkButton - Default appearance - Selected - Focused',
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	states: [
		{
			state: 'focused',
			selector: { byTestId: `LinkButton-default-selected` },
		},
	],
});

snapshot(LinkButtonGlobalStylesExample, {
	description: 'LinkButton - Primary appearance - Hovered',
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	states: [
		{
			state: 'hovered',
			selector: { byTestId: `LinkButton-primary` },
		},
	],
});

snapshot(LinkButtonGlobalStylesExample, {
	description: 'LinkButton - Primary appearance - Focused',
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	states: [
		{
			state: 'focused',
			selector: { byTestId: `LinkButton-primary` },
		},
	],
});

snapshot(LinkButtonGlobalStylesExample, {
	description: 'LinkButton - Primary appearance - Selected - Hovered',
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	states: [
		{
			state: 'hovered',
			selector: { byTestId: `LinkButton-primary-selected` },
		},
	],
});

snapshot(LinkButtonGlobalStylesExample, {
	description: 'LinkButton - Primary appearance - Selected - Focused',
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	states: [
		{
			state: 'focused',
			selector: { byTestId: `LinkButton-primary-selected` },
		},
	],
});

snapshot(LinkButtonGlobalStylesExample, {
	description: 'LinkIconButton - Default appearance - Hovered',
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	states: [
		{
			state: 'hovered',
			selector: { byTestId: `LinkIconButton-default` },
		},
	],
});

snapshot(LinkButtonGlobalStylesExample, {
	description: 'LinkIconButton - Default appearance - Focused',
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	states: [
		{
			state: 'focused',
			selector: { byTestId: `LinkIconButton-default` },
		},
	],
});

snapshot(LinkButtonGlobalStylesExample, {
	description: 'LinkIconButton - Default appearance - Selected - Hovered',
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	states: [
		{
			state: 'hovered',
			selector: { byTestId: `LinkIconButton-default-selected` },
		},
	],
});

snapshot(LinkButtonGlobalStylesExample, {
	description: 'LinkIconButton - Default appearance - Selected - Focused',
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	states: [
		{
			state: 'focused',
			selector: { byTestId: `LinkIconButton-default-selected` },
		},
	],
});
