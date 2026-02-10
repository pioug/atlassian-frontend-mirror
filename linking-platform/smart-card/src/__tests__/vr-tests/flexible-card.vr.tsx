import { snapshot } from '@af/visual-regression';

import FlexibleUiAccessibility from '../../../examples/vr-flexible-card/vr-flexible-ui-accessibility';
import FlexibleUiAccessibilityForbidden from '../../../examples/vr-flexible-card/vr-flexible-ui-accessibility-forbidden';
import FlexibleUiBlock from '../../../examples/vr-flexible-card/vr-flexible-ui-block';
import FlexibleUiBlockCardErroredStates from '../../../examples/vr-flexible-card/vr-flexible-ui-block-card-errored-states';
import FlexibleUiBlockEntities from '../../../examples/vr-flexible-card/vr-flexible-ui-block-entities';
import FlexibleUiBlockFooter from '../../../examples/vr-flexible-card/vr-flexible-ui-block-footer';
import FlexibleUiBlockMetadata from '../../../examples/vr-flexible-card/vr-flexible-ui-block-metadata';
import {
	FlexibleUiBlockPreviewLarge,
	FlexibleUiBlockPreviewMedium,
	FlexibleUiBlockPreviewMixedPadding,
	FlexibleUiBlockPreviewOverrideCSS,
	FlexibleUiBlockPreviewSmall,
	FlexibleUiBlockPreviewXLarge,
} from '../../../examples/vr-flexible-card/vr-flexible-ui-block-preview';
import FlexibleUiBlockSnippet from '../../../examples/vr-flexible-card/vr-flexible-ui-block-snippet';
import FlexibleUiBlockTitle from '../../../examples/vr-flexible-card/vr-flexible-ui-block-title';
import FlexibleUiComposition from '../../../examples/vr-flexible-card/vr-flexible-ui-composition';
import FlexibleUiElementAppliedToComponentsCount from '../../../examples/vr-flexible-card/vr-flexible-ui-element-applied-to-components-count';
import FlexibleUiElementAvatarGroup from '../../../examples/vr-flexible-card/vr-flexible-ui-element-avatar-group';
import FlexibleUiElementBadge from '../../../examples/vr-flexible-card/vr-flexible-ui-element-badge';
import FlexibleUiElementLink from '../../../examples/vr-flexible-card/vr-flexible-ui-element-link';
import FlexibleUiElementLozenge from '../../../examples/vr-flexible-card/vr-flexible-ui-element-lozenge';
import FlexibleUiElementMedia from '../../../examples/vr-flexible-card/vr-flexible-ui-element-media';
import FlexibleUiElementTeamMemberCount from '../../../examples/vr-flexible-card/vr-flexible-ui-element-team-member-count';
import FlexibleUiElementUserAttributes from '../../../examples/vr-flexible-card/vr-flexible-ui-element-user-attributes';
import FlexibleUiHoverCard from '../../../examples/vr-flexible-card/vr-flexible-ui-hover-card';
import FlexibleUiHoverCardNoPreviewButton from '../../../examples/vr-flexible-card/vr-flexible-ui-hover-card-no-preview-button';
import FlexibleUiOptions from '../../../examples/vr-flexible-card/vr-flexible-ui-options';
import FlexibleUiPlaceholderData from '../../../examples/vr-flexible-card/vr-flexible-ui-placeholder-data';

// Variants
snapshot(FlexibleUiOptions, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiComposition, {
	states: [
		{
			selector: {
				byTestId: 'smart-action-delete-action-0',
			},
			state: 'hovered',
		},
	],
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});

// Blocks
snapshot(FlexibleUiBlock, {
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'react-loadable causing uncaught error to be thrown',
			jiraIssueId: 'EDM-10562',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockTitle, {
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'react-loadable causing uncaught error to be thrown',
			jiraIssueId: 'EDM-10562',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockTitle, {
	description: 'flexible-ui-block-title--title hovered',
	states: [
		{
			selector: {
				byTestId: 'actions-on-hover-title-block-resolved-view',
			},
			state: 'hovered',
		},
	],
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'react-loadable causing uncaught error to be thrown',
			jiraIssueId: 'EDM-10562',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockTitle, {
	description: 'flexible-ui-block-title--more actions hovered',
	states: [
		{
			selector: {
				byTestId: 'action-group-more-button',
			},
			state: 'hovered',
		},
	],
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'react-loadable causing uncaught error to be thrown',
			jiraIssueId: 'EDM-10562',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockMetadata, {
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'react-loadable causing uncaught error to be thrown',
			jiraIssueId: 'EDM-10562',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockSnippet, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockFooter, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockPreviewXLarge, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockPreviewLarge, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockPreviewMedium, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockPreviewSmall, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockPreviewMixedPadding, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockPreviewOverrideCSS, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});

// Elements
snapshot(FlexibleUiElementLink, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiElementLozenge, {
	description: 'FlexibleUiElementLozenge',
	featureFlags: {
		'platform-component-visual-refresh': true,
		platform_navx_sl_lozenge_max_width: [true, false],
	},
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
snapshot(FlexibleUiElementBadge, {
	drawsOutsideBounds: true,
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'react-loadable causing uncaught error to be thrown',
			jiraIssueId: 'EDM-10562',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiElementAppliedToComponentsCount, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiElementAvatarGroup, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiElementMedia, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiElementTeamMemberCount, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiElementUserAttributes, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});

// Hovercard
snapshot(FlexibleUiHoverCard, {
	drawsOutsideBounds: true,
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'hovered',
		},
	],
	description: 'FlexibleUiHoverCard',
	featureFlags: {
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiHoverCardNoPreviewButton, {
	drawsOutsideBounds: true,
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'hovered',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});

// Accessibility
snapshot(FlexibleUiAccessibility, {
	description: 'flexible=ui-accessibility--title focused',
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'focused',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiAccessibility, {
	description: 'flexible=ui-accessibility--hidden action button focused',
	states: [
		{
			selector: {
				byTestId: 'action-group-more-button',
			},
			state: 'focused',
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiAccessibilityForbidden, {
	description: 'flexible=ui-accessibility--forbidden title focused',
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'focused',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiAccessibilityForbidden, {
	description: 'flexible=ui-accessibility--error message focused',
	states: [
		{
			selector: {
				byTestId: 'keyboard-2-errored-view-message',
			},
			state: 'focused',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
});

snapshot(FlexibleUiAccessibilityForbidden, {
	description: 'flexible=ui-accessibility--custom action item focused',
	states: [
		{
			selector: {
				byTestId: 'action-item-custom',
			},
			state: 'focused',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});

snapshot(FlexibleUiPlaceholderData, {
	description: `flexible-ui: with placeholder data for SSR`,
	featureFlags: {},
	waitForReactLazy: true,
});
// Error states
snapshot(FlexibleUiBlockCardErroredStates, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});

// Nouns
snapshot(FlexibleUiBlockEntities, {
	ignoredErrors: [],
	featureFlags: {},
	waitForReactLazy: true,
});
