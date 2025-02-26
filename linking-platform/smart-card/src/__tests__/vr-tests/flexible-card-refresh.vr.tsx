import { snapshot } from '@af/visual-regression';

import FlexibleUiAccessibility from '../../../examples/vr-flexible-card/vr-flexible-ui-accessibility';
import FlexibleUiAccessibilityForbidden from '../../../examples/vr-flexible-card/vr-flexible-ui-accessibility-forbidden';
import FlexibleUiBlockAction from '../../../examples/vr-flexible-card/vr-flexible-ui-action';
import FlexibleUiBlock from '../../../examples/vr-flexible-card/vr-flexible-ui-block';
import FlexibleUiBlockActionList from '../../../examples/vr-flexible-card/vr-flexible-ui-block-action';
import FlexibleUiBlockActionGroup from '../../../examples/vr-flexible-card/vr-flexible-ui-block-action-group';
import FlexibleUiBlockCardErroredStates from '../../../examples/vr-flexible-card/vr-flexible-ui-block-card-errored-states';
import FlexibleUiBlockFooter from '../../../examples/vr-flexible-card/vr-flexible-ui-block-footer';
import FlexibleUiBlockMetadata from '../../../examples/vr-flexible-card/vr-flexible-ui-block-metadata';
import FlexibleUiBlockPreview from '../../../examples/vr-flexible-card/vr-flexible-ui-block-preview';
import FlexibleUiBlockSnippet from '../../../examples/vr-flexible-card/vr-flexible-ui-block-snippet';
import FlexibleUiBlockTitle from '../../../examples/vr-flexible-card/vr-flexible-ui-block-title';
import FlexibleUiComposition from '../../../examples/vr-flexible-card/vr-flexible-ui-composition';
import FlexibleUiElementAvatarGroup from '../../../examples/vr-flexible-card/vr-flexible-ui-element-avatar-group';
import FlexibleUiElementBadge from '../../../examples/vr-flexible-card/vr-flexible-ui-element-badge';
import FlexibleUiElementLink from '../../../examples/vr-flexible-card/vr-flexible-ui-element-link';
import FlexibleUiElementLozenge from '../../../examples/vr-flexible-card/vr-flexible-ui-element-lozenge';
import FlexibleUiElementMedia from '../../../examples/vr-flexible-card/vr-flexible-ui-element-media';
import FlexibleUiHoverCard from '../../../examples/vr-flexible-card/vr-flexible-ui-hover-card';
import FlexibleUiHoverCardNoPreviewButton from '../../../examples/vr-flexible-card/vr-flexible-ui-hover-card-no-preview-button';
import FlexibleUiOptions from '../../../examples/vr-flexible-card/vr-flexible-ui-options';

// Variants
snapshot(FlexibleUiOptions, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
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
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

// Blocks
snapshot.skip(FlexibleUiBlock, {
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'react-loadable causing uncaught error to be thrown',
			jiraIssueId: 'EDM-10562',
		},
	],
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
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
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
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
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
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
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
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
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiBlockSnippet, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiBlockFooter, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiBlockPreview, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiBlockActionList, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiBlockAction, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiBlockActionGroup, {
	drawsOutsideBounds: true,
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiBlockActionGroup, {
	description: 'flexible-ui-block-action-group--item hovered',
	drawsOutsideBounds: true,
	states: [{ selector: { byTestId: 'smart-action-delete-action' }, state: 'hovered' }],
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiBlockActionGroup, {
	description: 'flexible-ui-block-action-group--item focused',
	drawsOutsideBounds: true,
	states: [{ selector: { byTestId: 'smart-action-delete-action' }, state: 'focused' }],
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

// Elements
snapshot(FlexibleUiElementLink, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiElementLozenge, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
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
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiElementAvatarGroup, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiElementMedia, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
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
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
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
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
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
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
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
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
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
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
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
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
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
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

// Error states
snapshot(FlexibleUiBlockCardErroredStates, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
// Flex block card forbidden snapshot already taken in
// platform/packages/linking-platform/smart-card/src/__tests__/vr-tests/block-card.vr.tsx (BlockCardForbiddenViews)
