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

// Variants
snapshot(FlexibleUiOptions, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
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
		'platform-component-visual-refresh': [true, false],
	},
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
		'platform-component-visual-refresh': [true, false],
	},
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
		'platform-component-visual-refresh': [true, false],
	},
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
		'platform-component-visual-refresh': [true, false],
	},
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
		'platform-component-visual-refresh': [true, false],
	},
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
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(FlexibleUiBlockSnippet, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(FlexibleUiBlockFooter, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(FlexibleUiBlockPreviewXLarge, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(FlexibleUiBlockPreviewLarge, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(FlexibleUiBlockPreviewMedium, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(FlexibleUiBlockPreviewSmall, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(FlexibleUiBlockPreviewMixedPadding, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(FlexibleUiBlockPreviewOverrideCSS, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});

// Elements
snapshot(FlexibleUiElementLink, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(FlexibleUiElementLozenge, {
	description: 'FlexibleUiElementLozenge',
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(FlexibleUiElementBadge, {
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'react-loadable causing uncaught error to be thrown',
			jiraIssueId: 'EDM-10562',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(FlexibleUiElementAppliedToComponentsCount, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(FlexibleUiElementAvatarGroup, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(FlexibleUiElementMedia, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(FlexibleUiElementTeamMemberCount, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-team-member-count-component': true,
	},
});
snapshot(FlexibleUiElementUserAttributes, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-user-attributes-component': true,
	},
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
		'platform-component-visual-refresh': [true, false],
	},
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
		'platform-component-visual-refresh': [true, false],
	},
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
		'platform-component-visual-refresh': [true, false],
	},
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
		'platform-component-visual-refresh': [true, false],
	},
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
		'platform-component-visual-refresh': [true, false],
	},
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
		'platform-component-visual-refresh': [true, false],
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
		'platform-component-visual-refresh': [true, false],
	},
});

// Error states
snapshot(FlexibleUiBlockCardErroredStates, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});

// Nouns
snapshot(FlexibleUiBlockEntities, {
	ignoredErrors: [],
	featureFlags: {},
});
