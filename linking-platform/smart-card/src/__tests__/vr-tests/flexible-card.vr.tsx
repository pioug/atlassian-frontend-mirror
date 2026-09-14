import { snapshot } from '@af/visual-regression';

import FlexibleUiAccessibilityForbidden from '../../../examples/vr-flexible-card/vr-flexible-ui-accessibility-forbidden.vr.ap';
import FlexibleUiAccessibility from '../../../examples/vr-flexible-card/vr-flexible-ui-accessibility.vr.ap';
import FlexibleUiBlockCardErroredStates from '../../../examples/vr-flexible-card/vr-flexible-ui-block-card-errored-states.vr.ap';
import FlexibleUiBlockEntities from '../../../examples/vr-flexible-card/vr-flexible-ui-block-entities.vr.ap';
import FlexibleUiBlockFooter from '../../../examples/vr-flexible-card/vr-flexible-ui-block-footer.vr.ap';
import FlexibleUiBlockMetadata from '../../../examples/vr-flexible-card/vr-flexible-ui-block-metadata.vr.ap';
import {
	FlexibleUiBlockPreviewLarge,
	FlexibleUiBlockPreviewMedium,
	FlexibleUiBlockPreviewMixedPadding,
	FlexibleUiBlockPreviewOverrideCSS,
	FlexibleUiBlockPreviewSmall,
	FlexibleUiBlockPreviewXLarge,
} from '../../../examples/vr-flexible-card/vr-flexible-ui-block-preview.vr.ap';
import FlexibleUiBlockSnippet from '../../../examples/vr-flexible-card/vr-flexible-ui-block-snippet.vr.ap';
import FlexibleUiBlockTitle from '../../../examples/vr-flexible-card/vr-flexible-ui-block-title.vr.ap';
import FlexibleUiBlock from '../../../examples/vr-flexible-card/vr-flexible-ui-block.vr.ap';
import FlexibleUiComposition from '../../../examples/vr-flexible-card/vr-flexible-ui-composition.vr.ap';
import FlexibleUiElementAppliedToComponentsCount from '../../../examples/vr-flexible-card/vr-flexible-ui-element-applied-to-components-count.vr.ap';
import FlexibleUiElementAvatarGroup from '../../../examples/vr-flexible-card/vr-flexible-ui-element-avatar-group.vr.ap';
import FlexibleUiElementBadge from '../../../examples/vr-flexible-card/vr-flexible-ui-element-badge.vr.ap';
import FlexibleUiElementLink from '../../../examples/vr-flexible-card/vr-flexible-ui-element-link.vr.ap';
import FlexibleUiElementLozenge from '../../../examples/vr-flexible-card/vr-flexible-ui-element-lozenge.vr.ap';
import FlexibleUiElementMedia from '../../../examples/vr-flexible-card/vr-flexible-ui-element-media.vr.ap';
import FlexibleUiElementTeamMemberCount from '../../../examples/vr-flexible-card/vr-flexible-ui-element-team-member-count.vr.ap';
import FlexibleUiElementUserAttributes from '../../../examples/vr-flexible-card/vr-flexible-ui-element-user-attributes.vr.ap';
import FlexibleUiHoverCardNoPreviewButton from '../../../examples/vr-flexible-card/vr-flexible-ui-hover-card-no-preview-button.vr.ap';
import FlexibleUiHoverCard from '../../../examples/vr-flexible-card/vr-flexible-ui-hover-card.vr.ap';
import FlexibleUiOptions from '../../../examples/vr-flexible-card/vr-flexible-ui-options.vr.ap';
import FlexibleUiPlaceholderData from '../../../examples/vr-flexible-card/vr-flexible-ui-placeholder-data.vr.ap';

// Variants
snapshot(FlexibleUiOptions, {
	featureFlags: {
		'platform-component-visual-refresh': true,
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
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockPreviewXLarge, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockPreviewLarge, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(FlexibleUiBlockPreviewMedium, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockPreviewSmall, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockPreviewMixedPadding, {
	featureFlags: {
		'platform-component-visual-refresh': true,
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
// NAVX-5074: To be investigated - test failed in pipeline (passed locally)
snapshot.skip(FlexibleUiElementBadge, {
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
	},
	waitForReactLazy: true,
});

// Nouns
snapshot(FlexibleUiBlockEntities, {
	ignoredErrors: [],
	featureFlags: {},
	waitForReactLazy: true,
});
