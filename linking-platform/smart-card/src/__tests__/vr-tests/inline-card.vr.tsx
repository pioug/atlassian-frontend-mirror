import { snapshot } from '@af/visual-regression';

import VRInlineCardAllExamplesInText from '../../../examples/vr-inline-card/vr-inline-card-all-examples-in-text';
import InlineCardDefaultWithEntities from '../../../examples/vr-inline-card/vr-inline-card-default-entities';
import InlineCardDefault from '../../../examples/vr-inline-card/vr-inline-card-default-icon';
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

snapshot(InlineCardDefaultWithEntities, {
	description: 'inline card with entity support',
	featureFlags: {},
	ignoredErrors: [],
});

snapshot(InlineCardDefault, {
	description: 'inline card renders correctly when hovering over url',
	featureFlags: {
		'jfp-magma-platform-lozenge-jump-fix': [true, false],
	},
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
		'jfp-magma-platform-lozenge-jump-fix': true,
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
	featureFlags: {
		'jfp-magma-platform-lozenge-jump-fix': [true, false],
	},
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
	featureFlags: {
		'navx-2565-inline-card-error-state-underline': true,
	},
});
snapshot(InlineCardError, {
	description: 'inline card error view renders correctly when hovering over url in errored view',
	featureFlags: {
		'navx-2565-inline-card-error-state-underline': true,
	},
	states: [{ state: 'hovered', selector: { byTestId: 'inline-card-errored-view' } }],
});
snapshot(InlineCardErrorTruncate, {
	description: 'inline card error view with truncation',
	featureFlags: {
		'navx-2565-inline-card-error-state-underline': true,
	},
});
snapshot(InlineCardForbidden, {
	description: 'inline card forbidden view',
	featureFlags: {
		'platform-component-visual-refresh': true,
		'jfp-magma-platform-lozenge-jump-fix': [true, false],
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
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
	},
});
snapshot(InlineCardForbiddenSiteRequestAccess, {
	description: 'inline card forbidden view with request access to site',
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
	},
});

snapshot(InlineCardForbiddenSiteRequestAccessTruncate, {
	description: 'inline card forbidden view with request access to site and truncation',
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
	},
});

snapshot(InlineCardForbiddenDirectAccess, {
	description: 'inline card forbidden view with direct access',
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
	},
});
snapshot(InlineCardForbiddenPendingSiteAccess, {
	description: 'inline card forbidden view with pending site access',
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
	},
});
snapshot(InlineCardForbiddenDeniedSiteAccess, {
	description: 'inline card forbidden view with denied site access',
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
	},
});

// Design refresh: emotion + legacy icon
snapshot(InlineCardForbiddenDefaultIcon, {
	description: 'inline card forbidden view with default legacy icon',
	featureFlags: {
		'jfp-magma-platform-lozenge-jump-fix': [true, false],
	},
});

// Design refresh: compiled + DS visual refresh
snapshot(InlineCardForbiddenDefaultIcon, {
	description: 'inline card forbidden view with default icon',
	featureFlags: {
		'platform-component-visual-refresh': true,
		'jfp-magma-platform-lozenge-jump-fix': [true, false],
	},
});
snapshot(InlineCardNotFound, {
	description: `inline card can't find link view`,
	featureFlags: {},
});
snapshot(InlineCardNotFound, {
	description:
		'inline card not found view renders correctly when hovering over url in not-found view',
	featureFlags: {},
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
	description: 'inline card unauthorised view with no auth',
});

snapshot(InlineCardFontSizeDefault, {
	description: 'inline card with default font size',
	featureFlags: {
		'jfp-magma-platform-lozenge-jump-fix': [true, false],
		'navx-1895-new-logo-design': [true, false],
	},
});

snapshot(InlineCardFontSize32, {
	description: 'inline card with 32 font size',
	featureFlags: {
		'jfp-magma-platform-lozenge-jump-fix': [true, false],
		'navx-1895-new-logo-design': [true, false],
	},
});

snapshot(InlineCardFontSize24, {
	description: 'inline card with 24 font size',
	featureFlags: {
		'jfp-magma-platform-lozenge-jump-fix': [true, false],
		'navx-1895-new-logo-design': [true, false],
	},
});

snapshot(InlineCardFontSize16, {
	description: 'inline card with 16 font size',
	featureFlags: {
		'jfp-magma-platform-lozenge-jump-fix': [true, false],
		'navx-1895-new-logo-design': [true, false],
	},
});

snapshot(InlineCardWordWrapResolving, {
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(InlineCardWordWrapResolved, {
	featureFlags: {
		'jfp-magma-platform-lozenge-jump-fix': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(InlineCardWordWrapForbidden, {
	featureFlags: {
		'jfp-magma-platform-lozenge-jump-fix': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(InlineCardWordWrapForbiddenWithSiteRequestAccess, {
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(InlineCardWordWrapForbiddenWithSitePendingRequest, {
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(InlineCardWordWrapNotFoundWithSiteAccessExists, {
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(InlineCardWordWrapUnAuth, {
	featureFlags: {},
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
		'platform-component-visual-refresh': true,
	},
});

snapshot.skip(InlineCardIcons, {
	description: `inline card icons`,
	featureFlags: {
	},
});

snapshot(VRInlineCardAllExamplesInText, {
	description: `inline card with all card examples in text`,
	featureFlags: {
		'platform-component-visual-refresh': true,
		'jfp-magma-platform-lozenge-jump-fix': [true, false],
	},
});

snapshot(VRInlineProfileCard, {
	featureFlags: {},
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'hover-card-trigger-wrapper' },
		},
	],
});
