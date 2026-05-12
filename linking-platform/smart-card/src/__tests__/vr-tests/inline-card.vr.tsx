import { snapshot } from '@af/visual-regression';

import VRInlineCardResolvedRovoActions from '../../../examples/vr-inline-card-resolved-rovo-actions';
import InlineCardWithStatus from '../../../examples/vr-inline-card-with-status';
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
import InlineCardResolvedIconVariations from '../../../examples/vr-inline-card/vr-inline-card-resolved-icon-variations';
import InlineCardSelected from '../../../examples/vr-inline-card/vr-inline-card-selected';
import InlineCardTextWrap from '../../../examples/vr-inline-card/vr-inline-card-text-wrap';
import InlineCardUnauthorised from '../../../examples/vr-inline-card/vr-inline-card-unauthorised';
import InlineCardUnauthorisedDefaultIcon from '../../../examples/vr-inline-card/vr-inline-card-unauthorised-default-icon';
import InlineCardUnauthorisedNoAuth from '../../../examples/vr-inline-card/vr-inline-card-unauthorised-no-auth';
import InlineCardUnauthorisedSocialProofLoaded from '../../../examples/vr-inline-card/vr-inline-card-unauthorised-social-proof-loaded';
import InlineCardUnauthorisedSocialProofLowExplore from '../../../examples/vr-inline-card/vr-inline-card-unauthorised-social-proof-low-explore';
import InlineCardUnauthorisedSocialProofLowNoContext from '../../../examples/vr-inline-card/vr-inline-card-unauthorised-social-proof-low-no-context';
import InlineCardUnauthorisedSocialProofNoContext from '../../../examples/vr-inline-card/vr-inline-card-unauthorised-social-proof-no-context';
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

/**
 * `useCurrentSiteCloudId` GETs `/_edge/tenant_info` in the browser;
 */
const mockEdgeTenantInfoRequests = [
	{
		urlPattern: /\/_edge\/tenant_info/,
		body: JSON.stringify({ cloudId: 'vr-mock-tenant-cloud-id' }),
		contentType: 'application/json',
	},
] as const;

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
});
snapshot(InlineCardError, {
	description: 'inline card error view renders correctly when hovering over url in errored view',
	states: [{ state: 'hovered', selector: { byTestId: 'inline-card-errored-view' } }],
});
snapshot(InlineCardErrorTruncate, {
	description: 'inline card error view with truncation',
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
		'navx-1895-new-logo-design': true,
	},
});
snapshot(InlineCardForbiddenSiteRequestAccess, {
	description: 'inline card forbidden view with request access to site',
	featureFlags: {
		'navx-1895-new-logo-design': true,
	},
});

snapshot(InlineCardForbiddenSiteRequestAccessTruncate, {
	description: 'inline card forbidden view with request access to site and truncation',
	featureFlags: {
		'navx-1895-new-logo-design': true,
	},
});

snapshot(InlineCardForbiddenDirectAccess, {
	description: 'inline card forbidden view with direct access',
	featureFlags: {
		'navx-1895-new-logo-design': true,
	},
});
snapshot(InlineCardForbiddenPendingSiteAccess, {
	description: 'inline card forbidden view with pending site access',
	featureFlags: {
		'navx-1895-new-logo-design': true,
	},
});
snapshot(InlineCardForbiddenDeniedSiteAccess, {
	description: 'inline card forbidden view with denied site access',
	featureFlags: {
		'navx-1895-new-logo-design': true,
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

snapshot(InlineCardUnauthorisedSocialProofLowExplore, {
	description: 'inline card unauthorised with social proof but low percentage',
	featureFlags: {
		platform_sl_3p_preauth_soc_proof_inline_killswitch: true,
		platform_sl_3p_preauth_social_proof_inline_cta: [true, false],
	},
	mockRequests: [...mockEdgeTenantInfoRequests],
});

snapshot(InlineCardUnauthorisedSocialProofLowExplore, {
	description: 'inline card unauthorised with social proof but low percentage - disabled FGs',
	featureFlags: {
		platform_sl_3p_preauth_soc_proof_inline_killswitch: false,
		platform_sl_3p_preauth_social_proof_inline_cta: false,
	},
	mockRequests: [...mockEdgeTenantInfoRequests],
});

snapshot(InlineCardUnauthorisedSocialProofLoaded, {
	description: 'inline card unauthorised with social proof',
	featureFlags: {
		platform_sl_3p_preauth_soc_proof_inline_killswitch: true,
		platform_sl_3p_preauth_social_proof_inline_cta: [true, false],
	},
	mockRequests: [...mockEdgeTenantInfoRequests],
});

snapshot(InlineCardUnauthorisedSocialProofLoaded, {
	description: 'inline card unauthorised with social proof - disabled FGs',
	featureFlags: {
		platform_sl_3p_preauth_soc_proof_inline_killswitch: false,
		platform_sl_3p_preauth_social_proof_inline_cta: false,
	},
	mockRequests: [...mockEdgeTenantInfoRequests],
});

snapshot(InlineCardUnauthorisedSocialProofNoContext, {
	description: 'inline card unauthorised social proof but no context available',
	featureFlags: {
		platform_sl_3p_preauth_soc_proof_inline_killswitch: true,
		platform_sl_3p_preauth_social_proof_inline_cta: [true, false],
	},
	mockRequests: [...mockEdgeTenantInfoRequests],
});

snapshot(InlineCardUnauthorisedSocialProofNoContext, {
	description: 'inline card unauthorised social proof but no context available - disabled FGs',
	featureFlags: {
		platform_sl_3p_preauth_soc_proof_inline_killswitch: false,
		platform_sl_3p_preauth_social_proof_inline_cta: false,
	},
	mockRequests: [...mockEdgeTenantInfoRequests],
});

snapshot(InlineCardUnauthorisedSocialProofLowNoContext, {
	description:
		'inline card unauthorised social proof with no context and no provider-specific percentage',
	featureFlags: {
		platform_sl_3p_preauth_soc_proof_inline_killswitch: true,
		platform_sl_3p_preauth_social_proof_inline_cta: [true, false],
	},
	mockRequests: [...mockEdgeTenantInfoRequests],
});

snapshot(InlineCardUnauthorisedSocialProofLowNoContext, {
	description:
		'inline card unauthorised social proof with no context and no provider-specific percentage - disabled FGs',
	featureFlags: {
		platform_sl_3p_preauth_soc_proof_inline_killswitch: false,
		platform_sl_3p_preauth_social_proof_inline_cta: false,
	},
	mockRequests: [...mockEdgeTenantInfoRequests],
});

snapshot(InlineCardFontSizeDefault, {
	description: 'inline card with default font size',
	featureFlags: {
		'jfp-magma-platform-lozenge-jump-fix': [true, false],
		'navx-1895-new-logo-design': true,
	},
});

snapshot(InlineCardFontSize32, {
	description: 'inline card with 32 font size',
	featureFlags: {
		'jfp-magma-platform-lozenge-jump-fix': [true, false],
		'navx-1895-new-logo-design': true,
	},
});

snapshot(InlineCardFontSize24, {
	description: 'inline card with 24 font size',
	featureFlags: {
		'jfp-magma-platform-lozenge-jump-fix': [true, false],
		'navx-1895-new-logo-design': true,
	},
});

snapshot(InlineCardFontSize16, {
	description: 'inline card with 16 font size',
	featureFlags: {
		'jfp-magma-platform-lozenge-jump-fix': [true, false],
		'navx-1895-new-logo-design': true,
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
		'navx-1895-new-logo-design': true,
	},
	waitForReactLazy: true,
});
snapshot(InlineCardWordWrapForbiddenWithSitePendingRequest, {
	featureFlags: {
		'navx-1895-new-logo-design': true,
	},
	waitForReactLazy: true,
});
snapshot(InlineCardWordWrapNotFoundWithSiteAccessExists, {
	featureFlags: {
		'navx-1895-new-logo-design': true,
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
	featureFlags: {},
});

snapshot(InlineCardResolvedIconVariations, {
	description:
		'inline card resolved icon variations (ResolvedClient iconTestUrls — extractIcon document / non-document paths)',
	featureFlags: {
		platform_sl_3p_preauth_better_hovercard_killswitch: true,
		platform_sl_3p_preauth_better_hovercard: true,
	},
	ignoredErrors: [
		{
			pattern: /Failed to load resource/,
			ignoredBecause: 'Icon test fixtures use external image URLs; dev build may log load noise',
			jiraIssueId: 'TODO-1',
		},
	],
});

snapshot(VRInlineCardAllExamplesInText, {
	description: `inline card with all card examples in text`,
	featureFlags: {
		'platform-component-visual-refresh': true,
		'jfp-magma-platform-lozenge-jump-fix': [true, false],
	},
});

snapshot(InlineCardWithStatus, {
	description: 'inline card with status lozenge',
	featureFlags: {
		'platform-dst-lozenge-tag-badge-visual-uplifts': [true, false],
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

snapshot(VRInlineCardResolvedRovoActions, {
	description: 'inline card resolved view with Rovo actions CTA (treatment)',
	featureFlags: {
		'smart-card-inline-resolved-view-refactor': true,
		'rovogrowth-640-inline-action-nudge-fg': true,
	},
});
