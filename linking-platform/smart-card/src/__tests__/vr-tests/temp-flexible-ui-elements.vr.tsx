/**
 * This file is a duplicate of all existing tests that are affected by the changes made in the FG platform-linking-flexible-card-elements-refactor
 * The intention is to remove the entirety of this file and related snapshots when the FG is cleaned up.
 * A separate file was used as to not clutter the other VR tests and to work around the limitation of 4 FG variations per test.
 * Theres also a bit of lazyness of not determining which specific tests are needed to be FG'd
 */

import { snapshot } from '@af/visual-regression';

import { BlockCardErrorView } from '../../../examples/vr-block-card/vr-block-card-error';
import { BlockCardForbiddenView } from '../../../examples/vr-block-card/vr-block-card-forbidden';
import {
	BlockCardLazyIcon1,
	BlockCardLazyIcon2,
	BlockCardLazyIcon3,
	BlockCardLazyIcon4,
	BlockCardLazyIcon5,
	BlockCardLazyIcon6,
	BlockCardLazyIconsFileType1,
	BlockCardLazyIconsFileType2,
	BlockCardLazyIconsFileType3,
	BlockCardLazyIconsFileType4,
} from '../../../examples/vr-block-card/vr-block-card-lazy-icons';
import { BlockCardNotFoundView } from '../../../examples/vr-block-card/vr-block-card-not-found';
import { BlockCardNotFoundSiteAccessExists } from '../../../examples/vr-block-card/vr-block-card-not-found-site-access-exists';
import { BlockCardAtlas } from '../../../examples/vr-block-card/vr-block-card-resolved-atlas';
import { BlockCardBitbucket } from '../../../examples/vr-block-card/vr-block-card-resolved-bitbucket';
import { BlockCardConfluence } from '../../../examples/vr-block-card/vr-block-card-resolved-confluence';
import { BlockCardJira } from '../../../examples/vr-block-card/vr-block-card-resolved-jira';
import { BlockCardNouns } from '../../../examples/vr-block-card/vr-block-card-resolved-nouns';
import { BlockCardTrello } from '../../../examples/vr-block-card/vr-block-card-resolved-trello-image-preview';
import { BlockCardUnauthorisedView } from '../../../examples/vr-block-card/vr-block-card-unauthorised';
import { BlockCardUnauthorisedViewWithNoAuth } from '../../../examples/vr-block-card/vr-block-card-unauthorised-no-auth';
import { VRBlockProfileCard } from '../../../examples/vr-block-card/vr-block-profile-card';
import { BlockCardForbiddenViews } from '../../../examples/vr-block-card/vr-flexible-block-card-variants-of-forbidden-views';
import { default as BlockCardSSR } from '../../../examples/vr-card-ssr/resolved-block-card-ssr';
import EmbedCardResolvedViewNoPreview from '../../../examples/vr-embed-card/vr-embed-card-resolved-no-preview';
import EmbedCardResolvingView from '../../../examples/vr-embed-card/vr-embed-card-resolving';
import FlexibleUiAccessibility from '../../../examples/vr-flexible-card/vr-flexible-ui-accessibility';
import FlexibleUiAccessibilityForbidden from '../../../examples/vr-flexible-card/vr-flexible-ui-accessibility-forbidden';
import FlexibleUiBlock from '../../../examples/vr-flexible-card/vr-flexible-ui-block';
import FlexUiBlockAiSummaryDone from '../../../examples/vr-flexible-card/vr-flexible-ui-block-ai-summary-done';
import FlexUiBlockAiSummaryDoneOnMount from '../../../examples/vr-flexible-card/vr-flexible-ui-block-ai-summary-done-on-mount';
import FlexUiBlockAiSummaryError from '../../../examples/vr-flexible-card/vr-flexible-ui-block-ai-summary-error';
import FlexUiBlockAiSummaryLoading from '../../../examples/vr-flexible-card/vr-flexible-ui-block-ai-summary-loading';
import FlexUiBlockAiSummaryReady from '../../../examples/vr-flexible-card/vr-flexible-ui-block-ai-summary-ready';
import FlexibleUiBlockCardErroredStates from '../../../examples/vr-flexible-card/vr-flexible-ui-block-card-errored-states';
import FlexibleUiBlockFooter from '../../../examples/vr-flexible-card/vr-flexible-ui-block-footer';
import FlexibleUiBlockMetadata from '../../../examples/vr-flexible-card/vr-flexible-ui-block-metadata';
import FlexibleUiBlockNouns from '../../../examples/vr-flexible-card/vr-flexible-ui-block-nouns';
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
import FlexUiAtlaskitBadgeView from '../../../examples/vr-flexible-card/vr-flexible-ui-element-atlaskit-badge';
import FlexibleUiElementAvatarGroup from '../../../examples/vr-flexible-card/vr-flexible-ui-element-avatar-group';
import FlexibleUiElementBadge from '../../../examples/vr-flexible-card/vr-flexible-ui-element-badge';
import FlexibleUiElementLink from '../../../examples/vr-flexible-card/vr-flexible-ui-element-link';
import FlexibleUiElementLozenge from '../../../examples/vr-flexible-card/vr-flexible-ui-element-lozenge';
import FlexibleUiElementMedia from '../../../examples/vr-flexible-card/vr-flexible-ui-element-media';
import FlexUiDateTimeTextView from '../../../examples/vr-flexible-card/vr-flexible-ui-element-text-and-date';
import FlexibleUiHoverCard from '../../../examples/vr-flexible-card/vr-flexible-ui-hover-card';
import FlexibleUiHoverCardNoPreviewButton from '../../../examples/vr-flexible-card/vr-flexible-ui-hover-card-no-preview-button';
import FlexibleUiOptions from '../../../examples/vr-flexible-card/vr-flexible-ui-options';
import HoverCardConfluence from '../../../examples/vr-hover-card-standalone/vr-hover-card-confluence';
import HoverCardForSlackMessage from '../../../examples/vr-hover-card-standalone/vr-hover-card-for-slack-message';
import HoverCardForbiddenJira from '../../../examples/vr-hover-card-standalone/vr-hover-card-forbidden-jira';
import HoverCardAssignedJiraIssue from '../../../examples/vr-hover-card-standalone/vr-hover-card-jira-assigned-issue';
import HoverCardJiraProject from '../../../examples/vr-hover-card-standalone/vr-hover-card-jira-project';
import HoverCardUnassignedJiraIssue from '../../../examples/vr-hover-card-standalone/vr-hover-card-jira-unassigned-issue';
import HoverCardWithPreview from '../../../examples/vr-hover-card-standalone/vr-hover-card-with-image-preview';
import HoverCardActions from '../../../examples/vr-hover-card/vr-hover-card-actions';
import HoverCardPositioning from '../../../examples/vr-hover-card/vr-hover-card-can-open-positioning';
import HoverCard from '../../../examples/vr-hover-card/vr-hover-cards';
import HoverCardWithNouns from '../../../examples/vr-hover-card/vr-hover-cards-nouns';
import HoverCardSSRError from '../../../examples/vr-hover-card/vr-hover-cards-ssr-error';
import HoverCardSSRLoading from '../../../examples/vr-hover-card/vr-hover-cards-ssr-loading';
import HoverCardUnauthorised from '../../../examples/vr-hover-card/vr-unauthorised-hover-cards';
import { VRInlineProfileCard } from '../../../examples/vr-inline-card/vr-inline-profile-card';
import RelatedLinksResolvedView from '../../../examples/vr-related-links-modal/vr-related-links-modal-resolved-view';
import RelatedLinksResolvedViewWithEmptyList from '../../../examples/vr-related-links-modal/vr-related-links-modal-resolved-view-empty-outgoing';

// ################################################################
// ||                                                            ||
// ||                          Card SSR                          ||
// ||                                                            ||
// ################################################################

snapshot(BlockCardSSR, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
	},
});

// ################################################################
// ||                                                            ||
// ||                        Inline Card                         ||
// ||                                                            ||
// ################################################################

snapshot(VRInlineProfileCard, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v2': true,
	},
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-card-trigger-wrapper' },
		},
	],
});

snapshot(VRInlineProfileCard, {
	description: 'inline profile card with platform-linking-visual-refresh-v2 false',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v2': false,
	},
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-card-trigger-wrapper' },
		},
	],
});

// ################################################################
// ||                                                            ||
// ||                    Related Links Modal                     ||
// ||                                                            ||
// ################################################################

snapshot(RelatedLinksResolvedView, {
	description: 'resolved',
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'dialog',
			},
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
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v2': [true, false],
	},
});

snapshot(RelatedLinksResolvedViewWithEmptyList, {
	description: 'resolved-empty',
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'dialog',
			},
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
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v2': [true, false],
	},
});

// ################################################################
// ||                                                            ||
// ||               Flex UI element Datetime Text                ||
// ||                                                            ||
// ################################################################

snapshot(FlexUiDateTimeTextView, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

// ################################################################
// ||                                                            ||
// ||               Flex UI element Atlaskit Badge               ||
// ||                                                            ||
// ################################################################

snapshot(FlexUiAtlaskitBadgeView, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

// ################################################################
// ||                                                            ||
// ||                         Embed card                         ||
// ||                                                            ||
// ################################################################

snapshot(EmbedCardResolvedViewNoPreview, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(EmbedCardResolvingView, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': true,
	},
});

snapshot(EmbedCardResolvedViewNoPreview, {
	description:
		'EmbedCardResolvedViewNoPreview OLD - delete when cleaning platform-linking-visual-refresh-v1',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': false,
	},
});
snapshot(EmbedCardResolvingView, {
	description:
		'EmbedCardResolvingView OLD - delete when cleaning platform-linking-visual-refresh-v1',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': false,
	},
});

// ################################################################
// ||                                                            ||
// ||                   Standalone Hover Card                    ||
// ||                                                            ||
// ################################################################

snapshot(HoverCard, {
	description: 'standalone hover card default',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

snapshot(HoverCardWithPreview, {
	description: 'standalone hover card with image Preview',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

snapshot(HoverCardForSlackMessage, {
	description: 'standalone hover card for Slack message',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

snapshot(HoverCardConfluence, {
	description: 'standalone hover card for Confluence',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

snapshot(HoverCardAssignedJiraIssue, {
	description: 'standalone hover card for Assigned Jira Issue',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-linking-visual-refresh-v2': [true, false],
	},
});

snapshot(HoverCardUnassignedJiraIssue, {
	description: 'standalone hover card for Unassigned Jira Issue',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-linking-visual-refresh-v2': [true, false],
	},
});

snapshot(HoverCardJiraProject, {
	description: 'standalone hover card for Jira Project',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

snapshot(HoverCardForbiddenJira, {
	description: 'standalone hover card forbidden view with direct_access context for Jira',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'DIRECT_ACCESS' },
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-smart-card-remove-legacy-button': [true, false],
	},
});

snapshot(HoverCardForbiddenJira, {
	description: 'standalone hover card forbidden view with request_access context for Jira',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'REQUEST_ACCESS' },
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-smart-card-remove-legacy-button': [true, false],
	},
});

snapshot(HoverCardForbiddenJira, {
	description: 'standalone hover card forbidden view with pending_request_exists context for Jira',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'PENDING_REQUEST_EXISTS' },
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

snapshot(HoverCardForbiddenJira, {
	description: 'standalone hover card forbidden view with denied_request_exists context for Jira',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'DENIED_REQUEST_EXISTS' },
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

snapshot(HoverCardForbiddenJira, {
	description:
		'standalone hover card forbidden view with access_exists context and visibility not_found for Jira',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'ACCESS_EXISTS-not_found' },
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

snapshot(HoverCardForbiddenJira, {
	description:
		'standalone hover card forbidden view with access_exists context and visibility restricted for Jira',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'ACCESS_EXISTS-restricted' },
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-smart-card-remove-legacy-button': [true, false],
	},
});

snapshot(HoverCardForbiddenJira, {
	description: 'standalone hover card forbidden view with forbidden context for Jira',
	states: [{ state: 'hovered', selector: { byTestId: 'FORBIDDEN' } }],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

// ################################################################
// ||                                                            ||
// ||                         Hover Card                         ||
// ||                                                            ||
// ################################################################

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
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

snapshot(HoverCardWithNouns, {
	description: 'hover-card: Nouns support',
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
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
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
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-linking-visual-refresh-v2': [true, false],
	},
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
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-linking-visual-refresh-v2': [true, false],
	},
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
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': true,
		'platform-smart-card-remove-legacy-button': [true, false],
	},
});

snapshot(HoverCardUnauthorised, {
	description:
		'Hover card unauthorised OLD - delete when cleaning platform-linking-visual-refresh-v1',
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-card-trigger-wrapper' },
		},
	],
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': false,
		'platform-smart-card-remove-legacy-button': [true, false],
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
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

snapshot(HoverCardSSRError, {
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-card-trigger-wrapper' },
		},
	],
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
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
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
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
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
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
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

// ################################################################
// ||                                                            ||
// ||                       Flexible Card                        ||
// ||                                                            ||
// ################################################################

// Variants
snapshot(FlexibleUiOptions, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
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
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
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
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
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
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
// Remove this test on cleanup of platform-linking-flexible-card-unresolved-action
snapshot(FlexibleUiBlockTitle, {
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'react-loadable causing uncaught error to be thrown',
			jiraIssueId: 'EDM-10562',
		},
	],
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-component-visual-refresh': true,
		'platform-linking-visual-refresh-v1': true,
		'platform-linking-visual-refresh-v2': true,
		'platform-linking-flexible-card-unresolved-action': true,
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
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
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
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
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
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiBlockSnippet, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiBlockFooter, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiBlockPreviewXLarge, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiBlockPreviewLarge, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiBlockPreviewMedium, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiBlockPreviewSmall, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiBlockPreviewMixedPadding, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiBlockPreviewOverrideCSS, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

// Elements
snapshot(FlexibleUiElementLink, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiElementLozenge, {
	description:
		'FlexibleUiElementLozenge Old - remove when cleaning platform-linking-visual-refresh-v2',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-linking-visual-refresh-v2': false,
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
snapshot(FlexibleUiElementLozenge, {
	description: 'FlexibleUiElementLozenge',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-linking-visual-refresh-v2': true,
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
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiElementAppliedToComponentsCount, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiElementAvatarGroup, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(FlexibleUiElementMedia, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
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
	description: 'FlexibleUiHoverCard Old - remove when cleaning platform-linking-visual-refresh-v2',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-linking-visual-refresh-v2': false,
	},
});
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
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-linking-visual-refresh-v2': true,
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
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
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
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
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
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
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
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
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
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
// Remove this test on cleanup of platform-linking-flexible-card-unresolved-action
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
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-component-visual-refresh': true,
		'platform-linking-visual-refresh-v1': true,
		'platform-linking-visual-refresh-v2': true,
		'platform-linking-flexible-card-unresolved-action': true,
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
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

// Error states
snapshot(FlexibleUiBlockCardErroredStates, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

// Nouns
snapshot(FlexibleUiBlockNouns, {
	ignoredErrors: [],
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		smart_links_noun_support: true,
	},
});

// ################################################################
// ||                                                            ||
// ||                         Block Card                         ||
// ||                                                            ||
// ################################################################

snapshot(BlockCardErrorView, {
	description: 'block card error view with design refresh FF',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-visual-refresh-icons': true,
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(BlockCardErrorView, {
	description: 'block card error view with design refresh FF only',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-visual-refresh-icons': [true, false],
	},
});
snapshot(BlockCardErrorView, {
	description: 'block card error view',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardForbiddenView, {
	description: 'block card forbidden view with design refresh FF',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-visual-refresh-icons': true,
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(BlockCardForbiddenView, {
	description: 'block card forbidden view with design refresh FF only',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-visual-refresh-icons': [true, false],
	},
});
snapshot(BlockCardForbiddenView, {
	description: 'block card forbidden view',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardForbiddenView);
snapshot(BlockCardNotFoundView, {
	description: 'block card not found view with design refresh FF',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-visual-refresh-icons': true,
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(BlockCardNotFoundView, {
	description: 'block card not found view with design refresh FF only',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-visual-refresh-icons': [true, false],
	},
});
snapshot(BlockCardNotFoundView, {
	description: 'block card not found view',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardNotFoundSiteAccessExists, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardUnauthorisedView, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(BlockCardUnauthorisedView, {
	description:
		'BlockCardUnauthorisedView Old - remove when cleaning platform-linking-visual-refresh-v1',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': false,
	},
});
snapshot(BlockCardUnauthorisedViewWithNoAuth, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardJira, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-linking-visual-refresh-v2': [true, false],
	},
});
snapshot(BlockCardConfluence, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardTrello, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardAtlas, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardBitbucket, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardForbiddenViews, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardLazyIcon1, {
	description: `block card with lazy load icons, slice 1`,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
	},
});
snapshot(BlockCardLazyIcon2, {
	description: `block card with lazy load icons, slice 2`,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
	},
});
snapshot(BlockCardLazyIcon3, {
	description: `block card with lazy load icons, slice 3`,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
	},
});
snapshot(BlockCardLazyIcon4, {
	description: `block card with lazy load icons, slice 4`,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
	},
});
snapshot(BlockCardLazyIcon5, {
	description: `block card with lazy load icons, slice 5`,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
	},
});
snapshot(BlockCardLazyIcon6, {
	description: `block card with lazy load icons, slice 6`,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
	},
});
snapshot(BlockCardLazyIconsFileType1, {
	description: `block card with lazy load icons per file format, slice 1`,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
	},
});
snapshot(BlockCardLazyIconsFileType2, {
	description: `block card with lazy load icons per file format, slice 2`,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
	},
});
snapshot(BlockCardLazyIconsFileType3, {
	description: `block card with lazy load icons per file format, slice 3`,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
	},
});
snapshot(BlockCardLazyIconsFileType4, {
	description: `block card with lazy load icons per file format, slice 4`,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
	},
});
snapshot(BlockCardNouns, {
	description: `block card with noun support`,
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		smart_links_noun_support: true,
	},
});

snapshot(VRBlockProfileCard, {
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v2': true,
	},
});

snapshot(VRBlockProfileCard, {
	description: 'block profile card with platform-linking-visual-refresh-v2 false',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-linking-visual-refresh-v2': false,
	},
});

// ################################################################
// ||                                                            ||
// ||                  Flex Ui Block AI Summary                  ||
// ||                                                            ||
// ################################################################

snapshot(FlexUiBlockAiSummaryReady, {
	drawsOutsideBounds: true,
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'hovered',
		},
	],
	description:
		'FlexUiBlockAiSummaryReady Old - remove when cleaning platform-linking-visual-refresh-v2',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-linking-visual-refresh-v2': false,
	},
});
snapshot(FlexUiBlockAiSummaryReady, {
	drawsOutsideBounds: true,
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'hovered',
		},
	],
	description: 'FlexUiBlockAiSummaryReady',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-linking-visual-refresh-v2': true,
	},
});

snapshot(FlexUiBlockAiSummaryLoading, {
	drawsOutsideBounds: true,
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'hovered',
		},
	],
	description:
		'FlexUiBlockAiSummaryLoading Old - remove when cleaning platform-linking-visual-refresh-v2',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-linking-visual-refresh-v2': false,
	},
});
snapshot(FlexUiBlockAiSummaryLoading, {
	drawsOutsideBounds: true,
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'hovered',
		},
	],
	description: 'FlexUiBlockAiSummaryLoading',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-linking-visual-refresh-v2': true,
	},
});

snapshot(FlexUiBlockAiSummaryDone, {
	drawsOutsideBounds: true,
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'hovered',
		},
	],
	description:
		'FlexUiBlockAiSummaryDone Old - remove when cleaning platform-linking-visual-refresh-v2',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-linking-visual-refresh-v2': false,
	},
});

snapshot(FlexUiBlockAiSummaryDone, {
	drawsOutsideBounds: true,
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'hovered',
		},
	],
	description: 'FlexUiBlockAiSummaryDone',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-linking-visual-refresh-v2': true,
	},
});

snapshot(FlexUiBlockAiSummaryDoneOnMount, {
	drawsOutsideBounds: true,
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'hovered',
		},
	],
	description:
		'FlexUiBlockAiSummaryDoneOnMount Old - remove when cleaning platform-linking-visual-refresh-v2',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-linking-visual-refresh-v2': false,
	},
});
snapshot(FlexUiBlockAiSummaryDoneOnMount, {
	drawsOutsideBounds: true,
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'hovered',
		},
	],
	description: 'FlexUiBlockAiSummaryDoneOnMount',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-linking-visual-refresh-v2': true,
	},
});

snapshot(FlexUiBlockAiSummaryError, {
	drawsOutsideBounds: true,
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'hovered',
		},
	],
	description:
		'FlexUiBlockAiSummaryError Old - remove when cleaning platform-linking-visual-refresh-v2',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-linking-visual-refresh-v2': false,
		'platform-linking-fix-a11y-in-smart-card': true,
	},
});
snapshot(FlexUiBlockAiSummaryError, {
	drawsOutsideBounds: true,
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'hovered',
		},
	],
	description: 'FlexUiBlockAiSummaryError',
	featureFlags: {
		'platform-linking-flexible-card-elements-refactor': [true],
		'platform-linking-flexible-card-context': true,
		'platform-linking-flexible-card-unresolved-action': true,
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-linking-visual-refresh-v2': true,
		'platform-linking-fix-a11y-in-smart-card': true,
	},
});
