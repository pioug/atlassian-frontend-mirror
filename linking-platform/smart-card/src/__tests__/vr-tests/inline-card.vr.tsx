import { snapshot } from '@af/visual-regression';

import VRInlineCardAllExamplesInText from '../../../examples/vr-inline-card/vr-inline-card-all-examples-in-text';
import InlineCardDefault from '../../../examples/vr-inline-card/vr-inline-card-default-icon';
import InlineCardDefaultWithNouns from '../../../examples/vr-inline-card/vr-inline-card-default-nouns';
import InlineCardDefaultTruncate from '../../../examples/vr-inline-card/vr-inline-card-default-truncate';
import InlineCardError from '../../../examples/vr-inline-card/vr-inline-card-error';
import InlineCardErrorTruncate from '../../../examples/vr-inline-card/vr-inline-card-error-truncate';
import InlineCardFontSize16 from '../../../examples/vr-inline-card/vr-inline-card-font-size-16';
import InlineCardFontSize24 from '../../../examples/vr-inline-card/vr-inline-card-font-size-24';
import InlineCardFontSize32 from '../../../examples/vr-inline-card/vr-inline-card-font-size-32';
import InlineCardFontSizeDefault from '../../../examples/vr-inline-card/vr-inline-card-font-size-default';
import InlineCardForbidden from '../../../examples/vr-inline-card/vr-inline-card-forbidden';
import InlineCardForbiddenDefaultIcon from '../../../examples/vr-inline-card/vr-inline-card-forbidden-default-icon';
import InlineCardForbiddenRequestAccess from '../../../examples/vr-inline-card/vr-inline-card-forbidden-request-access';
import InlineCardForbiddenDeniedSiteAccess from '../../../examples/vr-inline-card/vr-inline-card-forbidden-site-denied-access';
import InlineCardForbiddenDirectAccess from '../../../examples/vr-inline-card/vr-inline-card-forbidden-site-direct-access';
import InlineCardForbiddenPendingSiteAccess from '../../../examples/vr-inline-card/vr-inline-card-forbidden-site-pending-access';
import InlineCardForbiddenSiteRequestAccess from '../../../examples/vr-inline-card/vr-inline-card-forbidden-site-request-access';
import InlineCardForbiddenSiteRequestAccessTruncate from '../../../examples/vr-inline-card/vr-inline-card-forbidden-site-request-access-truncate';
import InlineCardForbiddenTruncate from '../../../examples/vr-inline-card/vr-inline-card-forbidden-truncate';
import InlineCardIcons from '../../../examples/vr-inline-card/vr-inline-card-icons';
import InlineCardNotFound from '../../../examples/vr-inline-card/vr-inline-card-not-found';
import InlineCardNotFoundTruncate from '../../../examples/vr-inline-card/vr-inline-card-not-found-truncate';
import InlineCardSelected from '../../../examples/vr-inline-card/vr-inline-card-selected';
import InlineCardTextWrap from '../../../examples/vr-inline-card/vr-inline-card-text-wrap';
import InlineCardUnauthorised from '../../../examples/vr-inline-card/vr-inline-card-unauthorised';
import InlineCardUnauthorisedDefaultIcon from '../../../examples/vr-inline-card/vr-inline-card-unauthorised-default-icon';
import InlineCardUnauthorisedNoAuth from '../../../examples/vr-inline-card/vr-inline-card-unauthorised-no-auth';
import InlineCardUnauthorisedTruncate from '../../../examples/vr-inline-card/vr-inline-card-unauthorised-truncate';
import {
	InlineCardWordWrapForbidden,
	InlineCardWordWrapForbiddenWithSitePendingRequest,
	InlineCardWordWrapForbiddenWithSiteRequestAccess,
	InlineCardWordWrapNotFoundWithSiteAccessExists,
	InlineCardWordWrapResolved,
	InlineCardWordWrapResolving,
	InlineCardWordWrapUnAuth,
} from '../../../examples/vr-inline-card/vr-inline-card-word-wrap';
import { VRInlineProfileCard } from '../../../examples/vr-inline-card/vr-inline-profile-card';

snapshot(InlineCardDefault, {
	description: 'inline card with default icon',
	featureFlags: {},
	ignoredErrors: [
		{
			pattern: /Failed to load resource/,
			ignoredBecause: 'This error is expected when rendering an error boundary in a dev build',
			jiraIssueId: 'TODO-1',
		},
	],
});

snapshot(InlineCardDefaultWithNouns, {
	description: 'inline card with Noun support',
	featureFlags: {
		smart_links_noun_support: true,
	},
	ignoredErrors: [],
});

snapshot(InlineCardDefault, {
	description: 'inline card renders correctly when hovering over url',
	featureFlags: {},
	ignoredErrors: [
		{
			pattern: /Failed to load resource/,
			ignoredBecause: 'This error is expected when rendering an error boundary in a dev build',
			jiraIssueId: 'TODO-1',
		},
	],
	states: [{ state: 'hovered', selector: { byTestId: 'inline-card-resolved-view' } }],
});

snapshot(InlineCardSelected, {
	description: 'inline card when selected',
	featureFlags: {
		'platform-smart-card-icon-migration': true,
	},
	ignoredErrors: [
		{
			pattern: /Failed to load resource/,
			ignoredBecause: 'This error is expected when rendering an error boundary in a dev build',
			jiraIssueId: 'TODO-1',
		},
	],
});
snapshot(InlineCardDefaultTruncate, {
	description: 'inline card with default icon and truncation',
	featureFlags: {},
	ignoredErrors: [
		{
			pattern: /Failed to load resource/,
			ignoredBecause: 'This error is expected when rendering an error boundary in a dev build',
			jiraIssueId: 'TODO-1',
		},
	],
});

snapshot(InlineCardTextWrap, {
	description: 'inline card with wrapped text renders correctly',
	featureFlags: {},
	ignoredErrors: [
		{
			pattern: /Failed to load resource/,
			ignoredBecause: 'This error is expected when rendering an error boundary in a dev build',
			jiraIssueId: 'TODO-1',
		},
	],
});
snapshot(InlineCardError, {
	description: 'inline card error view',
	featureFlags: {},
});
snapshot(InlineCardError, {
	description: 'inline card error view renders correctly when hovering over url in errored view',
	featureFlags: {},
	states: [{ state: 'hovered', selector: { byTestId: 'inline-card-errored-view' } }],
});
snapshot(InlineCardErrorTruncate, {
	description: 'inline card error view with truncation',
	featureFlags: {},
});
snapshot(InlineCardForbidden, {
	description: 'inline card forbidden view',
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(InlineCardForbidden, {
	description:
		'inline card forbidden view renders correctly when hovering over url in forbidden view',
	featureFlags: {},
	states: [{ state: 'hovered', selector: { byTestId: 'inline-card-forbidden-view' } }],
});

snapshot(InlineCardForbiddenTruncate, {
	description: 'inline card forbidden view with truncation',
	featureFlags: {},
});

snapshot(InlineCardForbiddenRequestAccess, {
	description: 'inline card forbidden view with request access to object',
	featureFlags: {},
});
snapshot(InlineCardForbiddenSiteRequestAccess, {
	description: 'inline card forbidden view with request access to site',
	featureFlags: {},
});

snapshot(InlineCardForbiddenSiteRequestAccessTruncate, {
	description: 'inline card forbidden view with request access to site and truncation',
	featureFlags: {},
});

snapshot(InlineCardForbiddenDirectAccess, {
	description: 'inline card forbidden view with direct access',
	featureFlags: {},
});
snapshot(InlineCardForbiddenPendingSiteAccess, {
	description: 'inline card forbidden view with pending site access',
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(InlineCardForbiddenDeniedSiteAccess, {
	description: 'inline card forbidden view with denied site access',
	featureFlags: {},
});

// Design refresh: emotion + legacy icon
snapshot(InlineCardForbiddenDefaultIcon, {
	description: 'inline card forbidden view with default legacy icon',
});

// Design refresh: compiled + DS visual refresh
snapshot(InlineCardForbiddenDefaultIcon, {
	description: 'inline card forbidden view with default icon',
	featureFlags: {
		'platform-smart-card-icon-migration': true,
		'platform-visual-refresh-icons': true,
		'platform-component-visual-refresh': true,
	},
});
snapshot(InlineCardNotFound, {
	description: `inline card can't find link view`,
	featureFlags: {},
});
snapshot(InlineCardNotFound, {
	description:
		'inline card not found view renders correctly when hovering over url in not-found view',
	featureFlags: {
		'platform-smart-card-icon-migration': true,
	},
	states: [{ state: 'hovered', selector: { byTestId: 'inline-card-not-found-view' } }],
});

snapshot(InlineCardNotFoundTruncate, {
	description: `inline card can't find link view with truncation`,
	featureFlags: {},
});

snapshot(InlineCardUnauthorised, {
	description: `inline card unauthorised view`,
	featureFlags: {},
});
snapshot(InlineCardUnauthorised, {
	description:
		'inline card unauthorised view renders correctly when hovering over url in unauthorized view',
	featureFlags: {},
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'inline-card-unauthorized-view' },
		},
	],
});

snapshot(InlineCardUnauthorisedTruncate, {
	description: `inline card unauthorised view with truncation`,
	featureFlags: {},
});

snapshot(InlineCardUnauthorised, {
	description: 'inline card unauthorised view renders correctly when hovering over connect account',
	featureFlags: {},
	states: [{ state: 'hovered', selector: { byTestId: 'button-connect-account' } }],
});
snapshot(InlineCardUnauthorisedNoAuth, {
	description: `inline card unauthorised view with no auth`,
	featureFlags: {},
});

snapshot(InlineCardFontSizeDefault, {
	description: 'inline card with default font size',
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

snapshot(InlineCardFontSize32, {
	description: 'inline card with 32 font size',
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

snapshot(InlineCardFontSize24, {
	description: 'inline card with 24 font size',
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

snapshot(InlineCardFontSize16, {
	description: 'inline card with 16 font size',
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

snapshot(InlineCardWordWrapResolving, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(InlineCardWordWrapResolved, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(InlineCardWordWrapForbidden, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(InlineCardWordWrapForbiddenWithSiteRequestAccess, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(InlineCardWordWrapForbiddenWithSitePendingRequest, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(InlineCardWordWrapNotFoundWithSiteAccessExists, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(InlineCardWordWrapUnAuth, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
	},
	waitForReactLazy: true,
});
// Design refresh: emotion + legacy icon
snapshot(InlineCardUnauthorisedDefaultIcon, {
	description: 'inline card unauthorised view with default legacy icon',
});

// Design refresh: compiled + DS visual refresh
snapshot(InlineCardUnauthorisedDefaultIcon, {
	description: 'inline card unauthorised view with default icon',
	featureFlags: {
		'platform-smart-card-icon-migration': true,
		'platform-visual-refresh-icons': true,
		'platform-component-visual-refresh': true,
	},
});

snapshot(InlineCardIcons, {
	description: `inline card icons`,
	featureFlags: {
		'platform-visual-refresh-icons': true,
		'platform-smart-card-icon-migration': true,
	},
});

snapshot(VRInlineCardAllExamplesInText, {
	description: `inline card with all card examples in text`,
	featureFlags: {
		'platform-component-visual-refresh': true,
		'platform-smart-card-icon-migration': true,
		'platform-linking-visual-refresh-v1': true,
	},
});

// TODO: Remove on platform-linking-visual-refresh-v1
snapshot(VRInlineCardAllExamplesInText, {
	description: `inline card with all card examples in text OLD`,
	featureFlags: {
		'platform-component-visual-refresh': false,
		'platform-smart-card-icon-migration': false,
		'platform-linking-visual-refresh-v1': false,
	},
});

// TODO: Remove on platform-linking-visual-refresh-v1
snapshot(VRInlineCardAllExamplesInText, {
	description: `inline card with all card examples in text COMPILED ONLY`,
	featureFlags: {
		'platform-component-visual-refresh': false,
		'platform-smart-card-icon-migration': false,
		'platform-linking-visual-refresh-v1': false,
	},
});

snapshot(VRInlineProfileCard, {
	featureFlags: {
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
